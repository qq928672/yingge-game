// 鶯歌壯遊 —— 高頻遊戲 API（Cloudflare Workers + D1）
//
// 只負責會被大量同時呼叫的動作：登入、答題、過關判定、點數兌換/核銷。
// 報名表單、序號產生與寄信、商家/店家內容管理，仍留在 Google Sheets + Apps Script，
// 那邊在序號產生後會呼叫這裡的 /sync-code，把新序號同步進來，兩邊序號才會一致。
//
// 需要在 Cloudflare 後台（或用 `wrangler secret put`）設定三個 secret：
//   ANSWER_KEY_JSON — 跟 backend_apps_script.gs 裡的 ANSWER_KEY 內容一模一樣，但是「字串化」
//   STAFF_PASSCODE  — 核銷背包用的工作人員通關密語，要跟 GAS 那邊設一樣的值（如果兩邊都在用的話）
//   SYNC_SECRET     — Apps Script 呼叫 /sync-code 時要帶的密鑰，隨便一組隨機字串即可

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_ATTEMPTS = 15;

// 商城目錄（Merchants/RewardItems）還在 Google Sheets，purchase 時要回頭查這裡拿權威價格
const GAS_URL = "https://script.google.com/macros/s/AKfycbytcB8w4wDFOK32d8g4FrcEiK3TQNDj0Ob8aFPINFo5t7c_jqMDfzBgnVcyailEjpPMeg/exec";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function normalizeCode(c) {
  return (c || "").toString().trim().replace(/\s+/g, "").toUpperCase();
}

function normalizeAnswer(s) {
  return (s || "").toString().trim().replace(/\s+/g, "").toUpperCase();
}

function getAnswerKey(env) {
  return JSON.parse(env.ANSWER_KEY_JSON);
}

async function checkRateLimit(env, code) {
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT window_start, count FROM rate_limits WHERE code = ?")
    .bind(code).first();
  if (!row || now - row.window_start >= RATE_LIMIT_WINDOW_SECONDS) {
    await env.DB.prepare(
      "INSERT INTO rate_limits (code, window_start, count) VALUES (?, ?, 1) " +
      "ON CONFLICT(code) DO UPDATE SET window_start = excluded.window_start, count = 1"
    ).bind(code, now).run();
    return true;
  }
  if (row.count >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE code = ?").bind(code).run();
  return true;
}

async function getProgressForCode(env, code) {
  const { results } = await env.DB.prepare("SELECT station_id FROM progress WHERE code = ?").bind(code).all();
  const progress = {};
  results.forEach(r => { progress[r.station_id] = true; });
  return progress;
}

async function getVerifiedQuestionsForStation(env, code, stationId) {
  const { results } = await env.DB.prepare(
    "SELECT q_index FROM answers WHERE code = ? AND station_id = ?"
  ).bind(code, stationId).all();
  const done = {};
  results.forEach(r => { done[r.q_index] = true; });
  return done;
}

async function getInventoryForCode(env, code) {
  const { results } = await env.DB.prepare(
    "SELECT id, item_id, merchant_name, item_name, cost, bought_at, used, used_at FROM inventory WHERE code = ? ORDER BY id"
  ).bind(code).all();
  return results.map(r => ({
    row: r.id,
    itemId: r.item_id,
    merchant: r.merchant_name,
    name: r.item_name,
    cost: r.cost,
    boughtAt: r.bought_at,
    used: !!r.used,
    usedAt: r.used_at || "",
  }));
}

async function getBalance(env, code) {
  const progress = await getProgressForCode(env, code);
  const completed = Object.keys(progress).length;
  const inv = await getInventoryForCode(env, code);
  const spent = inv.reduce((sum, it) => sum + it.cost, 0);
  return completed - spent;
}

// ---------- action handlers ----------

async function handleLogin(env, rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "序號為空" };

  const player = await env.DB.prepare("SELECT code, name FROM players WHERE code = ?").bind(code).first();
  if (!player) return { ok: false, error: "查無此序號，請確認報名信件內容" };

  await env.DB.prepare("UPDATE players SET last_login = datetime('now') WHERE code = ?").bind(code).run();

  return {
    ok: true, code, name: player.name,
    progress: await getProgressForCode(env, code),
    balance: await getBalance(env, code),
    inventory: await getInventoryForCode(env, code),
  };
}

async function handleSubmitAnswer(env, rawCode, stationId, qIndex, rawAnswer) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "序號為空" };

  if (!(await checkRateLimit(env, code))) {
    return { ok: false, error: "嘗試次數過多，請稍等一分鐘再試" };
  }

  const answerKey = getAnswerKey(env);
  const accepted = answerKey[String(stationId)] && answerKey[String(stationId)][String(qIndex)];
  if (!accepted) return { ok: false, error: "找不到這一題的資料" };

  let correct;
  if (accepted.length > 1) {
    const givenArr = Array.isArray(rawAnswer) ? rawAnswer : [rawAnswer];
    const givenSet = givenArr.map(normalizeAnswer).filter(Boolean).sort();
    const acceptedSet = accepted.map(normalizeAnswer).sort();
    correct = givenSet.length === acceptedSet.length && givenSet.every((v, i) => v === acceptedSet[i]);
  } else {
    const given = normalizeAnswer(Array.isArray(rawAnswer) ? rawAnswer[0] : rawAnswer);
    correct = normalizeAnswer(accepted[0]) === given;
  }

  if (correct) {
    // D1 沒有像 GAS LockService 那樣的手動鎖，但 INSERT OR IGNORE + 複合主鍵
    // (code, station_id, q_index) 本身就能防止同一題被重複寫入，效果一樣
    await env.DB.prepare(
      "INSERT OR IGNORE INTO answers (code, station_id, q_index) VALUES (?, ?, ?)"
    ).bind(code, stationId, qIndex).run();
  }

  return { ok: true, correct };
}

async function handleComplete(env, rawCode, stationId) {
  const code = normalizeCode(rawCode);
  const player = await env.DB.prepare("SELECT code, name FROM players WHERE code = ?").bind(code).first();
  if (!player) return { ok: false, error: "查無此序號" };

  const answerKey = getAnswerKey(env);
  const expected = answerKey[String(stationId)];
  if (!expected) return { ok: false, error: "找不到這個站點的資料" };
  const expectedCount = Object.keys(expected).length;

  const verified = await getVerifiedQuestionsForStation(env, code, stationId);
  const verifiedCount = Object.keys(verified).length;
  if (verifiedCount < expectedCount) {
    return { ok: false, error: "尚未答對所有題目，無法標記完成", verifiedCount, expectedCount };
  }

  await env.DB.prepare(
    "INSERT OR IGNORE INTO progress (code, station_id) VALUES (?, ?)"
  ).bind(code, stationId).run();

  return {
    ok: true, code, name: player.name,
    progress: await getProgressForCode(env, code),
    balance: await getBalance(env, code),
  };
}

// 商城目錄還是留在 Google Sheets（GAS）管理。兌換時只信「商品 ID」，價格/名稱/商家
// 一律回頭去查 GAS 的商城目錄拿權威版本，不會相信前端傳來的任何價格數字
// ——不然只要改一下瀏覽器送出的請求，就能用 0 點換到任何商品
async function getAuthoritativeItem(itemId) {
  const res = await fetch(GAS_URL + "?action=rewards");
  const data = await res.json();
  if (!data.ok) return null;
  for (const merchant of data.merchants || []) {
    const found = (merchant.items || []).find(it => it.id === itemId);
    if (found) return { item: found, merchant };
  }
  return null;
}

async function handlePurchase(env, rawCode, itemId) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "序號為空" };
  const player = await env.DB.prepare("SELECT code FROM players WHERE code = ?").bind(code).first();
  if (!player) return { ok: false, error: "查無此序號" };

  if (!itemId) return { ok: false, error: "商品資料不完整" };

  const found = await getAuthoritativeItem(itemId);
  if (!found) return { ok: false, error: "查無此商品" };
  const { item, merchant } = found;

  const balance = await getBalance(env, code);
  if (balance < item.cost) return { ok: false, error: "獎章不足，無法兌換" };

  await env.DB.prepare(
    "INSERT INTO inventory (code, item_id, merchant_name, item_name, cost) VALUES (?, ?, ?, ?, ?)"
  ).bind(code, item.id, merchant.name || "", item.name, item.cost).run();

  return { ok: true, balance: balance - item.cost, inventory: await getInventoryForCode(env, code) };
}

async function handleRedeemItem(env, rawCode, invRow, staffPasscode) {
  if (staffPasscode !== env.STAFF_PASSCODE) {
    return { ok: false, error: "工作人員密語錯誤，無法核銷" };
  }
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: "序號為空" };

  const row = await env.DB.prepare("SELECT id, code, used FROM inventory WHERE id = ?").bind(Number(invRow)).first();
  if (!row) return { ok: false, error: "找不到這筆兌換紀錄" };
  if (normalizeCode(row.code) !== code) return { ok: false, error: "序號不符，無法核銷" };
  if (row.used) return { ok: false, error: "這筆已經核銷過了" };

  await env.DB.prepare(
    "UPDATE inventory SET used = 1, used_at = datetime('now') WHERE id = ?"
  ).bind(row.id).run();

  return { ok: true, inventory: await getInventoryForCode(env, code) };
}

// Apps Script 表單產生序號後呼叫這個，把新序號同步進 D1，兩邊序號才會一致
async function handleSyncCode(env, code, name, syncSecret) {
  if (syncSecret !== env.SYNC_SECRET) {
    return { ok: false, error: "sync secret 不符" };
  }
  const normalized = normalizeCode(code);
  if (!normalized) return { ok: false, error: "序號為空" };

  await env.DB.prepare(
    "INSERT INTO players (code, name) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET name = excluded.name"
  ).bind(normalized, name || "").run();

  return { ok: true };
}

// 給管理用網頁查資料用：回傳所有玩家＋進度統計＋兌換紀錄，用工作人員通關密語保護
// （跟核銷共用同一組密語，避免又多一組要記的密碼）
async function handleAdminData(env, passcode) {
  if (passcode !== env.STAFF_PASSCODE) {
    return { ok: false, error: "密語錯誤，無法查看" };
  }

  const players = (await env.DB.prepare(
    "SELECT code, name, created_at, last_login FROM players ORDER BY created_at DESC"
  ).all()).results;

  const progressRows = (await env.DB.prepare(
    "SELECT code, station_id, completed_at FROM progress ORDER BY completed_at DESC"
  ).all()).results;

  const answerRows = (await env.DB.prepare(
    "SELECT code, station_id, q_index, answered_at FROM answers ORDER BY answered_at DESC"
  ).all()).results;

  const inventoryRows = (await env.DB.prepare(
    "SELECT id, code, item_id, merchant_name, item_name, cost, bought_at, used, used_at FROM inventory ORDER BY bought_at DESC"
  ).all()).results;

  // 每個玩家順便算好「完成站數」跟「餘額」，管理頁不用自己再算一次
  const progressCountByCode = {};
  progressRows.forEach(r => { progressCountByCode[r.code] = (progressCountByCode[r.code] || 0) + 1; });
  const spentByCode = {};
  inventoryRows.forEach(r => { spentByCode[r.code] = (spentByCode[r.code] || 0) + r.cost; });

  const playersWithStats = players.map(p => ({
    ...p,
    completedCount: progressCountByCode[p.code] || 0,
    balance: (progressCountByCode[p.code] || 0) - (spentByCode[p.code] || 0),
  }));

  // 兌換/核銷紀錄只有序號的話看不出來是誰兌換的，順便帶上玩家姓名
  const nameByCode = {};
  players.forEach(p => { nameByCode[p.code] = p.name || ""; });

  return {
    ok: true,
    players: playersWithStats,
    progress: progressRows,
    answers: answerRows,
    inventory: inventoryRows.map(r => ({ ...r, used: !!r.used, name: nameByCode[r.code] || "" })),
  };
}

// ---------- routing ----------

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return json({ ok: true });

    const url = new URL(request.url);

    try {
      if (request.method === "GET") {
        const action = url.searchParams.get("action");
        if (action === "login" || action === "state") {
          return json(await handleLogin(env, url.searchParams.get("code")));
        }
        if (action === "admin") {
          return json(await handleAdminData(env, url.searchParams.get("passcode")));
        }
        return json({ ok: false, error: "未知的 action: " + action }, 404);
      }

      if (request.method === "POST") {
        const body = await request.json();
        const action = body.action;
        if (action === "submitAnswer") {
          return json(await handleSubmitAnswer(env, body.code, body.stationId, body.qIndex, body.answer));
        }
        if (action === "complete") {
          return json(await handleComplete(env, body.code, body.stationId));
        }
        if (action === "purchase") {
          return json(await handlePurchase(env, body.code, body.itemId));
        }
        if (action === "redeemItem") {
          return json(await handleRedeemItem(env, body.code, body.invRow, body.staffPasscode));
        }
        if (action === "syncCode") {
          return json(await handleSyncCode(env, body.code, body.name, body.syncSecret));
        }
        return json({ ok: false, error: "未知的 action: " + action }, 404);
      }

      return json({ ok: false, error: "不支援的方法" }, 405);
    } catch (err) {
      return json({ ok: false, error: String(err) }, 500);
    }
  },
};
