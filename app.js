
// 只在本機測試環境顯示測試用功能（例如重置站點進度），正式上線的網址不會出現
const IS_LOCAL_DEV = ["localhost", "127.0.0.1"].includes(location.hostname);

// ---------- Backend API ----------
// 混合架構：報名/商店/兌換品項目錄這些低頻、由 Google Sheets 管理的資料還是走 GAS；
// 登入、答題、過關判定、點數兌換/核銷這些活動當天會被大量同時呼叫的動作，
// 改走 Cloudflare Workers + D1（並發撐得比 GAS 高很多），靠 action 名稱分流。
const API_URL = "https://script.google.com/macros/s/AKfycbytcB8w4wDFOK32d8g4FrcEiK3TQNDj0Ob8aFPINFo5t7c_jqMDfzBgnVcyailEjpPMeg/exec";
const WORKER_API_URL = "https://yingge-game-api.ntcecea.workers.dev";
const WORKER_ACTIONS = new Set(["login", "state", "submitAnswer", "complete", "purchase", "redeemItem"]);

// 現場網路常常不穩、後端偶爾會逾時，所以連線失敗時自動重試幾次再放棄，
// 減少玩家自己手動按「再試一次」的機會（伺服器回傳的業務錯誤，例如序號錯誤，
// 屬於正常回應不會走到這裡，只有 fetch 本身失敗或回應不是合法 JSON 才會重試）
async function fetchJsonWithRetry(doFetch, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await doFetch();
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise(r => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw lastErr;
}

async function apiGet(params) {
  const base = WORKER_ACTIONS.has(params.action) ? WORKER_API_URL : API_URL;
  const url = base + "?" + new URLSearchParams(params).toString();
  return fetchJsonWithRetry(() => fetch(url));
}

async function apiPost(body) {
  if (WORKER_ACTIONS.has(body.action)) {
    return fetchJsonWithRetry(() => fetch(WORKER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(body),
    }));
  }
  // 用 text/plain 避免瀏覽器對 Apps Script 發出 CORS 預檢請求（Apps Script 不處理 OPTIONS）
  return fetchJsonWithRetry(() => fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  }));
}

let state = { code: null, progress: {}, name: "", balance: 0, inventory: [] };

function normalize(str) {
  return (str || "").trim().replace(/\s+/g, "").toUpperCase();
}

// ---------- Text-to-speech (accessibility for players who have trouble reading) ----------
// Android Chrome loads its voice list asynchronously — calling speak() before that finishes
// silently produces no sound at all (no error). We warm the list up on load and, if it's
// still empty when speak() is first called, wait once for "voiceschanged" before speaking.

let ttsVoices = [];
if ("speechSynthesis" in window) {
  const loadVoices = () => { ttsVoices = window.speechSynthesis.getVoices(); };
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

function pickChineseVoice() {
  if (!ttsVoices.length) return null;
  return (
    ttsVoices.find(v => v.lang === "zh-TW") ||
    ttsVoices.find(v => /zh[-_](TW|Hant)/i.test(v.lang)) ||
    ttsVoices.find(v => v.lang === "zh-CN") ||
    ttsVoices.find(v => /^zh/i.test(v.lang)) ||
    null
  );
}

function speakNow(text) {
  window.speechSynthesis.cancel(); // stop any speech already in progress before starting new
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-TW";
  utter.rate = 0.95;
  const voice = pickChineseVoice();
  if (voice) utter.voice = voice;
  utter.onerror = (e) => console.warn("TTS failed:", e.error);
  window.speechSynthesis.speak(utter);
}

let lastSpeakAt = 0;

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  // ignore rapid repeated taps on the speak button — besides being pointless (it just
  // restarts the same line), spamming speak() in quick succession is what seems to trigger
  // Android's "Google - tap to see search results" overlay on some devices
  const now = Date.now();
  if (now - lastSpeakAt < 600) return;
  lastSpeakAt = now;
  if (!ttsVoices.length) {
    // voice list not ready yet (common on first use in Android Chrome) — wait once, then speak
    let spoken = false;
    const trySpeak = () => {
      if (spoken) return;
      spoken = true;
      ttsVoices = window.speechSynthesis.getVoices();
      speakNow(text);
    };
    window.speechSynthesis.addEventListener("voiceschanged", trySpeak, { once: true });
    // some browsers never fire voiceschanged if there's truly nothing new to load — try anyway after a short delay
    setTimeout(trySpeak, 300);
    return;
  }
  speakNow(text);
}

async function handleLogin() {
  const raw = document.getElementById("code-input").value;
  const code = normalize(raw);
  const errEl = document.getElementById("login-error");
  const btn = document.getElementById("login-btn");
  if (!code) { errEl.textContent = "請輸入序號"; return; }
  errEl.textContent = "登入中...";
  if (btn) btn.disabled = true;
  try {
    const res = await apiGet({ action: "login", code });
    if (!res.ok) {
      errEl.textContent = res.error || "序號錯誤，請確認報名信件內容";
      return;
    }
    errEl.textContent = "";
    state.code = res.code;
    loadPlayerIntoState(res);
    localStorage.setItem("yingge_last_code", res.code);
    resetIdleTimer();
    showMap();
  } catch (e) {
    errEl.textContent = "連線失敗，請檢查網路後再試一次";
  } finally {
    if (btn) btn.disabled = false;
  }
}

function loadPlayerIntoState(data) {
  state.name = data.name;
  state.progress = data.progress || {};
  if (typeof data.balance === "number") state.balance = data.balance;
  if (data.inventory) state.inventory = data.inventory; // only login/purchase/redeem send this; complete doesn't touch it
}

function logout() {
  state = { code: null, progress: {}, name: "", balance: 0, inventory: [] };
  localStorage.removeItem("yingge_last_code");
  localStorage.removeItem("yingge_pending_arrival");
  document.getElementById("code-input").value = "";
  document.getElementById("login-error").textContent = "";
  document.getElementById("login-card").style.display = "";
  document.getElementById("login-restoring").style.display = "none";
  showScreen("screen-login");
  stopIdleTimer();
}

// ---------- Idle auto-logout: stay signed in indefinitely, but log out after 15 minutes with no interaction ----------
const IDLE_LIMIT_MS = 15 * 60 * 1000;
let idleTimer = null;

function resetIdleTimer() {
  if (!state.code) return; // only relevant once logged in
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (state.code) logout();
  }, IDLE_LIMIT_MS);
}

function stopIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = null;
}

["click", "touchstart", "keydown", "scroll"].forEach(evt =>
  window.addEventListener(evt, resetIdleTimer, { passive: true })
);

// screens that live behind the bottom tab bar — any other screen hides it
const TAB_SCREENS = { "screen-map": "map", "screen-stamps": "stamps", "screen-rewards": "rewards", "screen-backpack": "backpack" };

function showScreen(id) {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel(); // don't let TTS keep talking after the player navigates away
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  const tabbar = document.getElementById("tabbar");
  const tabKey = TAB_SCREENS[id];
  tabbar.classList.toggle("visible", !!tabKey);
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.screen === tabKey));
}

function completedCount() {
  return Object.values(state.progress).filter(Boolean).length;
}

function showMap() {
  showScreen("screen-map");
  renderMap();
}

function openStampBook() {
  showScreen("screen-stamps");
  renderStampBook();
}

const STATION_SYMBOLS = { 1: "行", 2: "陶", 3: "石", 4: "瓷", 5: "爐", 6: "繪", 7: "榕", 8: "文", 9: "廟", 10: "街" };

function renderStampBook() {
  const done = completedCount();
  const total = STATIONS.length;
  document.getElementById("stampCount").innerHTML = done + "<small>／" + total + "</small>";
  document.getElementById("stampReward").textContent = done < total ? "每完成一站可得 1 枚獎章，快去交換所看看" : "全部蓋滿了，獎章都已入袋！";
  const stampGridEl = document.getElementById("stampGrid");
  stampGridEl.innerHTML = "";
  STATIONS.forEach(st => {
    const slot = document.createElement("div");
    slot.className = "stamp-slot " + (state.progress[st.id] ? "filled" : "empty");
    slot.textContent = STATION_SYMBOLS[st.id] || String(st.id).padStart(2, "0");
    stampGridEl.appendChild(slot);
  });

  const grid = document.getElementById("station-grid");
  grid.innerHTML = "";
  STATIONS.forEach(st => {
    const done = !!state.progress[st.id];
    const name = st.name.replace(/^站點[一二三四五六七八九十]+/, "");

    const card = document.createElement("div");
    card.className = "collect-card" + (done ? " done" : "");
    card.onclick = () => openStation(st.id);

    const statusLine = done
      ? `<div class="card-status">✓ 已收藏</div>`
      : `<div class="card-status">尚未解鎖</div>`;

    const posOverride = st.bgPosition ? `background-position:${st.bgPosition};` : "";
    const imageLayer = st.background
      ? `<div class="card-img${done ? "" : " grayscale"}" style="background-image:url('${encodeURI(st.background)}');${posOverride}"></div>`
      : `<div class="card-lock">${done ? "🖼️" : (st.icon || "🔒")}</div>`;

    card.innerHTML = `
      ${imageLayer}
      ${done ? `<div class="card-badge">✓</div>` : ""}
      <div class="card-bottom">
        <div class="card-stamp">${stampSvg(st)}</div>
        <div class="card-notes">
          <div class="card-no">NO. ${String(st.id).padStart(2, "0")}</div>
          <div class="card-name">${name}</div>
          ${statusLine}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// A hand-stamped-looking badge for each station: two off-register rings (like a real rubber
// stamp with imperfect registration) around the station number. No image generation involved —
// this is a CSS/SVG stand-in until real per-location artwork exists.
const STAMP_PALETTE = ["#7c9885", "#c98a5e", "#8a95a8", "#a8896f", "#7c9885"];
function stampSvg(st) {
  const c = STAMP_PALETTE[(st.id - 1) % STAMP_PALETTE.length];
  const num = String(st.id).padStart(2, "0");
  return `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="41" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.9"/>
    <text x="50" y="63" text-anchor="middle" font-family="'Noto Serif TC', serif" font-weight="600" font-size="40" fill="${c}">${num}</text>
  </svg>`;
}

/* ---------- Interactive station map (Leaflet) — replaces the old card-list ---------- */
let stationMap = null;
const mapMarkers = {};
let mapMeMarker = null;
let lastNearestMapId = null;
const mapMeIcon = L.divIcon({ className: "", html: `<div class="me-dot"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });

function mapPinIcon(st, done, isNearest) {
  const cls = isNearest ? "nearest" : done ? "done" : "locked";
  const html = `<div class="map-pin-wrap ${cls}">
    <div class="map-pin-ring"></div>
    <div class="map-pin">${done ? "✓" : st.id}</div>
    <div class="map-pin-tail"></div>
  </div>`;
  return L.divIcon({ className: "", html, iconSize: [38, 48], iconAnchor: [19, 46] });
}

function initStationMap() {
  if (stationMap) return;
  const withLoc = STATIONS.filter(s => s.location);
  const center = withLoc.length
    ? [withLoc.reduce((a, s) => a + s.location.lat, 0) / withLoc.length, withLoc.reduce((a, s) => a + s.location.lng, 0) / withLoc.length]
    : [24.9540, 121.3545];
  stationMap = L.map("stationMap", { zoomControl: false }).setView(center, 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(stationMap);
  withLoc.forEach(st => {
    const done = !!state.progress[st.id];
    mapMarkers[st.id] = L.marker([st.location.lat, st.location.lng], { icon: mapPinIcon(st, done, false) })
      .addTo(stationMap).on("click", () => openMapSheet(st, done));
  });
  setTimeout(locateForMap, 400);

  // 只有「畫面上完全看不到任何一個站點圖示」時才浮現復位按鈕，而且是滑動/縮放
  // 結束後才判斷（不是滑動途中），手指在地圖上操作時不會不小心先點到它；
  // recenterStationMap 自己觸發的位移用 recenterInProgress 擋掉，不會滑完又立刻跳出同一顆按鈕
  stationMap.on("moveend", () => {
    if (recenterInProgress) return;
    const bounds = stationMap.getBounds();
    const anyStationVisible = withLoc.some(st => bounds.contains([st.location.lat, st.location.lng]));
    document.getElementById("mapRecenterBtn").classList.toggle("show", !anyStationVisible);
  });
}

let recenterInProgress = false;

// 有人把地圖滑到很遠的地方找不回來，按這顆按鈕直接縮放回「看得到所有關卡圖示」的範圍
function recenterStationMap() {
  if (!stationMap) return;
  const withLoc = STATIONS.filter(s => s.location);
  if (!withLoc.length) return;
  document.getElementById("mapRecenterBtn").classList.remove("show");
  recenterInProgress = true;
  const bounds = L.latLngBounds(withLoc.map(s => [s.location.lat, s.location.lng]));
  stationMap.flyToBounds(bounds, { padding: [48, 48], maxZoom: 17 });
  stationMap.once("moveend", () => { recenterInProgress = false; });
}

function updateMapMarkers() {
  Object.keys(mapMarkers).forEach(id => {
    const st = STATIONS.find(s => s.id === Number(id));
    const done = !!state.progress[st.id];
    mapMarkers[id].setIcon(mapPinIcon(st, done, Number(id) === lastNearestMapId));
  });
}

let myLastLat = null, myLastLng = null;

function updateNearestOnMap(lat, lng) {
  myLastLat = lat; myLastLng = lng;
  const withLoc = STATIONS.filter(s => s.location);
  let nearest = null, nearestDist = Infinity;
  withLoc.forEach(st => {
    const d = haversineMeters(lat, lng, st.location.lat, st.location.lng);
    if (d < nearestDist) { nearestDist = d; nearest = st; }
  });
  if (!nearest) return;
  lastNearestMapId = nearest.id;
  updateMapMarkers();
  if (!mapMeMarker) mapMeMarker = L.marker([lat, lng], { icon: mapMeIcon, zIndexOffset: 500 }).addTo(stationMap);
  else mapMeMarker.setLatLng([lat, lng]);
  const chip = document.getElementById("nearestChip");
  chip.style.display = "flex";
  document.getElementById("nearestName").textContent = nearest.name.replace(/^站點[一二三四五六七八九十]+\s*/, "");
  document.getElementById("nearestDist").textContent = nearestDist < 1000 ? Math.round(nearestDist) + " 公尺" : (nearestDist / 1000).toFixed(1) + " 公里";
  chip.onclick = () => openMapSheet(nearest, !!state.progress[nearest.id]);
}

function locateForMap() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    pos => updateNearestOnMap(pos.coords.latitude, pos.coords.longitude),
    () => {}, // permission denied / unavailable — the map still works fine without the "nearest" banner
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// 測試用：只清掉本機記憶體裡的完成狀態，讓開發者能重新走一次某一站的 RPG 劇情，
// 不會呼叫後端、不會動到 Google 試算表的 Progress 分頁——重新整理或重新登入後仍會顯示已完成。
// 只在 IS_LOCAL_DEV 時顯示按鈕，正式上線的網址不會出現，不用手動移除。
let devResetTargetId = null;
function devResetStation() {
  if (devResetTargetId == null) return;
  const st = STATIONS.find(s => s.id === devResetTargetId);
  if (!confirm(`確定要重置「${st ? st.name.replace(/^站點[一二三四五六七八九十]+\s*/, "") : devResetTargetId}」的完成狀態嗎？\n（只影響這次瀏覽，不會刪除伺服器上的紀錄）`)) return;
  delete state.progress[devResetTargetId];
  closeMapSheet();
  renderMap();
}

function openMapSheet(st, done) {
  devResetTargetId = st.id;
  document.getElementById("mapSheetDevReset").style.display = (IS_LOCAL_DEV && done) ? "block" : "none";
  document.getElementById("mapSheetNo").textContent = "NO. " + String(st.id).padStart(2, "0");
  document.getElementById("mapSheetName").textContent = st.name.replace(/^站點[一二三四五六七八九十]+\s*/, "");
  document.getElementById("mapSheetAddr").textContent = st.address ? "📍 " + st.address : "📍 位置資訊尚未提供";
  const distEl = document.getElementById("mapSheetDist");
  if (st.location && myLastLat !== null) {
    const d = haversineMeters(myLastLat, myLastLng, st.location.lat, st.location.lng);
    distEl.textContent = "距離你目前位置約 " + (d < 1000 ? Math.round(d) + " 公尺" : (d / 1000).toFixed(1) + " 公里");
    distEl.style.display = "block";
  } else {
    distEl.style.display = "none";
  }
  document.getElementById("mapSheetPhoto").style.backgroundImage = st.background ? `url('${encodeURI(st.background)}')` : "";
  const navBtn = document.getElementById("mapSheetNav");
  if (st.location) {
    navBtn.style.display = "block";
    navBtn.onclick = () => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${st.location.lat},${st.location.lng}&travelmode=walking`;
      window.open(url, "_blank");
    };
  } else {
    navBtn.style.display = "none";
  }
  const statusEl = document.getElementById("mapSheetStatus");
  if (done) { statusEl.textContent = "✓ 已完成"; statusEl.className = "map-sheet-status done"; }
  else { statusEl.textContent = "尚未解鎖"; statusEl.className = "map-sheet-status locked"; }
  document.getElementById("mapSheetGo").textContent = done ? "已完成關卡" : "開始關卡";
  document.getElementById("mapSheetGo").onclick = done
    ? () => { alert("此關卡已破關，請前往其他關卡"); }
    : () => { closeMapSheet(); openStation(st.id); };
  document.getElementById("mapSheet").classList.add("active");
  document.getElementById("mapSheetBackdrop").classList.add("active");
}
function closeMapSheet() {
  document.getElementById("mapSheet").classList.remove("active");
  document.getElementById("mapSheetBackdrop").classList.remove("active");
}

function renderMap() {
  initStationMap();
  updateMapMarkers();
  if (stationMap) setTimeout(() => stationMap.invalidateSize(), 50);

  const done = completedCount();
  document.getElementById("done-count").textContent = done;
  document.getElementById("mapUsername").textContent = state.name || "";

  let hint = "";
  if (done < 10) hint = "每完成一站即可獲得 1 枚獎章，快去獎章商城看看";
  else hint = "恭喜全部完成！";
  document.getElementById("reward-hint").textContent = hint;
}

// ---------- Ticket wallet ----------


// ---------- Rewards shop (token economy — merchants → items → purchase → backpack) ----------

// Placeholder icons (same line-icon language as the tab bar) for merchants/items that don't
// have a real photo yet — keyed by merchant id or name so it still matches after a rename.
const ICON_POTTERY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3c-.5 2-1 2.5-1 4.5C9 10 7 11 7 14.5S9 21 12 21s5-3 5-6.5-2-4.5-2-7c0-2-.5-2.5-1-4.5"/></svg>`;
const ICON_TEA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M9 3c0 1-1 1-1 2s1 1 1 2M13 3c0 1-1 1-1 2s1 1 1 2"/></svg>`;
const ICON_BREAD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13c0-4.5 3.5-8 8-8s8 3.5 8 8-3 6-8 6-8-1.5-8-6z"/><path d="M9 10c.5 1 .5 2 0 3M13 9c.5 1.5.5 3 0 4.5"/></svg>`;
const ICON_GIFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 9h16M12 9v11"/><path d="M12 9c-1.5 0-3-1-3-2.5S10 4 12 6c0-2 1.5-3.5 3-2.5S13.5 9 12 9z"/></svg>`;
const ICON_BIKE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-8h4l3 8M10 9l2 4h5M9 5h3l1 2"/></svg>`;
const ICON_STORE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l1-5h14l1 5"/><path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M5 9v10h14V9"/><path d="M10 19v-5h4v5"/></svg>`;
const MERCHANT_ICONS = {
  "yingshao": { icon: ICON_POTTERY, color: "var(--purple)" },
  "鶯燒陶藝工作室": { icon: ICON_POTTERY, color: "var(--purple)" },
  "oldstreet-tea": { icon: ICON_TEA, color: "var(--accent)" },
  "老街茶館": { icon: ICON_TEA, color: "var(--accent)" },
  "sanying-bakery": { icon: ICON_BREAD, color: "var(--clay)" },
  "三鶯窯烤麵包坊": { icon: ICON_BREAD, color: "var(--clay)" },
  "ceramic-souvenir": { icon: ICON_GIFT, color: "var(--yellow-dark)" },
  "陶瓷老街紀念品鋪": { icon: ICON_GIFT, color: "var(--yellow-dark)" },
  "riverside-bike": { icon: ICON_BIKE, color: "var(--done)" },
  "河濱單車租借站": { icon: ICON_BIKE, color: "var(--done)" },
};
// merchant/item rows carry the merchant's id in the catalog, but backpack rows only store its
// name (the Inventory sheet was written that way) — keying by both lets this work in either place
function thumbHtml(photo, merchantKey, cls) {
  if (photo) return `<div class="${cls}" style="background-image:url('${encodeURI(photo)}')"></div>`;
  const cfg = MERCHANT_ICONS[merchantKey] || null;
  const color = cfg ? cfg.color : "var(--sub)";
  const icon = cfg ? cfg.icon : ICON_STORE;
  return `<div class="${cls} icon-fallback" style="background:${color}">${icon}</div>`;
}

let rewardsCatalog = null; // cached after first fetch; the catalog itself doesn't need a login

async function getRewardsCatalog() {
  if (rewardsCatalog) return rewardsCatalog;
  try {
    const res = await apiGet({ action: "rewards" });
    rewardsCatalog = res.ok ? (res.merchants || []) : [];
  } catch (e) {
    rewardsCatalog = [];
  }
  return rewardsCatalog;
}

// 商家分類篩選 — "全部" 一律顯示，其餘只列出目錄裡實際有出現的分類，順序依 MERCHANT_CATEGORIES
const MERCHANT_CATEGORIES = ["手作體驗", "美食飲品", "伴手禮", "交通"];
let shopCategoryFilter = "全部";

async function openRewardsShop() {
  showScreen("screen-rewards");
  document.getElementById("shop-balance-num").textContent = state.balance;
  const list = document.getElementById("merchant-list");
  list.innerHTML = `<p class="shop-empty">載入中...</p>`;
  const catalog = await getRewardsCatalog();
  if (!catalog.length) {
    document.getElementById("shop-category-filter").innerHTML = "";
    list.innerHTML = `<p class="shop-empty">目前還沒有可兌換的好禮，請稍後再來看看</p>`;
    return;
  }
  renderCategoryFilter(catalog);
  renderMerchantList(catalog);
}

function renderCategoryFilter(catalog) {
  const present = new Set(catalog.map(m => m.category).filter(Boolean));
  const cats = ["全部", ...MERCHANT_CATEGORIES.filter(c => present.has(c))];
  const el = document.getElementById("shop-category-filter");
  el.innerHTML = cats.map(c =>
    `<div class="shop-category-chip${c === shopCategoryFilter ? " active" : ""}" onclick="selectShopCategory('${escapeAttr(c)}')">${c}</div>`
  ).join("");
}

function selectShopCategory(cat) {
  shopCategoryFilter = cat;
  const catalog = rewardsCatalog || [];
  renderCategoryFilter(catalog);
  renderMerchantList(catalog);
}

function renderMerchantList(catalog) {
  const list = document.getElementById("merchant-list");
  const filtered = shopCategoryFilter === "全部" ? catalog : catalog.filter(m => m.category === shopCategoryFilter);
  if (!filtered.length) {
    list.innerHTML = `<p class="shop-empty">這個分類目前還沒有商家</p>`;
    return;
  }
  list.innerHTML = filtered.map(m => `
    <div class="merchant-card" onclick="openMerchantDetail('${escapeAttr(m.id)}')">
      ${thumbHtml(m.photo, m.id, "merchant-thumb")}
      <div class="merchant-body">
        <div class="merchant-name">${m.name}</div>
        <div class="merchant-tagline">${m.tagline || ""}</div>
        <div class="merchant-count">共 ${m.items.length} 項好禮</div>
      </div>
    </div>
  `).join("");
}

function openShopOverlay(html) {
  document.getElementById("shop-overlay-card").innerHTML = html;
  document.getElementById("shop-overlay").classList.add("active");
}
function closeShopOverlay() {
  document.getElementById("shop-overlay").classList.remove("active");
}

async function openMerchantDetail(merchantId) {
  const catalog = await getRewardsCatalog();
  const m = catalog.find(x => x.id === merchantId);
  if (!m) return;
  openShopOverlay(`
    <div class="shop-card">
      <div class="shop-card-close" onclick="closeShopOverlay()">✕</div>
      ${thumbHtml(m.photo, m.id, "shop-card-photo")}
      <div class="shop-card-name">${m.name}</div>
      <div class="shop-card-tagline">${m.tagline || ""}</div>
      <div class="shop-card-intro">${m.intro || ""}</div>
      <div style="margin-top:16px;font-weight:700;font-size:13px;color:var(--ink);">可兌換項目</div>
      ${m.items.map(it => `
        <div class="shop-item-row" onclick="openItemDetail('${escapeAttr(m.id)}','${escapeAttr(it.id)}')">
          ${thumbHtml(it.photo, m.id, "shop-item-thumb")}
          <div>
            <div class="shop-item-name">${it.name}</div>
            <div class="shop-item-cost">🏅 ${it.cost} 枚</div>
          </div>
        </div>
      `).join("")}
    </div>
  `);
}

async function openItemDetail(merchantId, itemId) {
  const catalog = await getRewardsCatalog();
  const m = catalog.find(x => x.id === merchantId);
  const it = m && m.items.find(x => x.id === itemId);
  if (!it) return;
  const can = state.balance >= it.cost;
  const photos = (it.photos && it.photos.length) ? it.photos : (it.photo ? [{ src: it.photo, caption: "" }] : []);
  openShopOverlay(`
    <div class="shop-card">
      <div class="shop-card-close" onclick="closeShopOverlay()">✕</div>
      <div class="shop-item-back" onclick="openMerchantDetail('${escapeAttr(merchantId)}')">‹ 返回 ${m.name}</div>
      ${photoCarouselHtml(photos, merchantId)}
      <div class="shop-card-name">${it.name}</div>
      <div class="shop-item-desc">${it.desc || ""}</div>
      <div class="shop-item-cost-big">🏅 ${it.cost} 枚</div>
      <button class="shop-buy-btn" ${can ? "" : "disabled"} onclick="buyItem('${escapeAttr(itemId)}')">${can ? "兌換，存入背包" : "獎章不足"}</button>
    </div>
  `);
  initShopCarousel(photos);
}

// 商品照片輪播——只有一張圖時直接顯示（不用輪播的複雜度），兩張以上才會出現左右箭頭／圓點／可滑動
let shopCarouselPhotos = [];
let shopCarouselIndex = 0;

function photoCarouselHtml(photos, fallbackKey) {
  if (!photos.length) return thumbHtml(null, fallbackKey, "shop-card-photo");
  if (photos.length === 1) {
    return `
      ${thumbHtml(photos[0].src, fallbackKey, "shop-card-photo")}
      ${photos[0].caption ? `<div class="shop-photo-caption-static">${escapeHtmlText(photos[0].caption)}</div>` : ""}
    `;
  }
  const slides = photos.map(p => `<div class="shop-photo-slide" style="background-image:url('${encodeURI(p.src)}')"></div>`).join("");
  const dots = photos.map((_, i) => `<button type="button" class="shop-photo-dot${i === 0 ? " active" : ""}" onclick="event.stopPropagation(); shopCarouselJump(${i})"></button>`).join("");
  return `
    <div class="shop-photo-carousel" id="shopCarousel" data-count="${photos.length}">
      <div class="shop-photo-track" id="shopCarouselTrack">${slides}</div>
      <button type="button" class="shop-photo-arrow prev" onclick="event.stopPropagation(); shopCarouselGo(-1)">‹</button>
      <button type="button" class="shop-photo-arrow next" onclick="event.stopPropagation(); shopCarouselGo(1)">›</button>
      ${photos[0].caption ? `<div class="shop-photo-caption" id="shopCarouselCaption">${escapeHtmlText(photos[0].caption)}</div>` : `<div class="shop-photo-caption" id="shopCarouselCaption" style="display:none;"></div>`}
      <div class="shop-photo-dots" id="shopCarouselDots">${dots}</div>
    </div>
  `;
}

function initShopCarousel(photos) {
  shopCarouselPhotos = photos;
  shopCarouselIndex = 0;
  const el = document.getElementById("shopCarousel");
  if (!el) return;
  let startX = null;
  el.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", e => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) shopCarouselGo(dx > 0 ? -1 : 1);
    startX = null;
  }, { passive: true });
}

function shopCarouselGo(dir) {
  const track = document.getElementById("shopCarouselTrack");
  const el = document.getElementById("shopCarousel");
  if (!track || !el) return;
  const count = Number(el.dataset.count);
  shopCarouselIndex = (shopCarouselIndex + dir + count) % count;
  track.style.transform = `translateX(-${shopCarouselIndex * 100}%)`;
  document.querySelectorAll("#shopCarouselDots .shop-photo-dot").forEach((d, i) => d.classList.toggle("active", i === shopCarouselIndex));
  const caption = (shopCarouselPhotos[shopCarouselIndex] && shopCarouselPhotos[shopCarouselIndex].caption) || "";
  const captionEl = document.getElementById("shopCarouselCaption");
  captionEl.textContent = caption;
  captionEl.style.display = caption ? "block" : "none";
}

function shopCarouselJump(i) {
  shopCarouselGo(i - shopCarouselIndex);
}

async function buyItem(itemId) {
  try {
    // 這裡只是先確認商品在目錄裡存在，給個快速的錯誤訊息；實際價格一律由伺服器端
    // 重新核對，前端算出來的價格/商品資訊不會被信任（也不會送出去）
    const catalog = await getRewardsCatalog();
    const exists = catalog.some(m => m.items.some(it => it.id === itemId));
    if (!exists) { alert("查無此商品"); return; }
    const res = await apiPost({ action: "purchase", code: state.code, itemId });
    if (!res.ok) { alert(res.error || "兌換失敗，請再試一次"); return; }
    state.balance = res.balance;
    state.inventory = res.inventory || state.inventory;
    document.getElementById("shop-balance-num").textContent = state.balance;
    openShopOverlay(`
      <div class="shop-card">
        <div class="shop-success">
          <div class="emoji">🎒</div>
          <h3>已加入背包！</h3>
          <p>到現場消費時，出示背包內容給店家核銷即可使用</p>
          <button onclick="closeShopOverlay(); openBackpack();">前往背包查看</button>
        </div>
      </div>
    `);
  } catch (e) {
    alert("連線失敗，請檢查網路後再試一次");
  }
}

function openBackpack() {
  showScreen("screen-backpack");
  renderBackpack();
}

function renderBackpack() {
  const list = document.getElementById("bag-list");
  if (!state.inventory.length) {
    list.innerHTML = `<p class="shop-empty">背包目前是空的，去獎章商城逛逛吧！</p>`;
    return;
  }
  list.innerHTML = state.inventory.map(it => `
    <div class="bag-card${it.used ? " used" : ""}">
      ${thumbHtml(it.photo, it.merchant, "bag-thumb")}
      <div class="bag-body">
        <div class="bag-merchant">${it.merchant}</div>
        <div class="bag-name">${it.name}</div>
        <div class="bag-status ${it.used ? "used" : "unused"}">${it.used ? "✓ 已核銷" : "尚未使用"}</div>
      </div>
      ${it.used ? "" : `<button class="bag-use-btn" onclick="openRedeemItem(${it.row})">使用</button>`}
    </div>
  `).join("");
}

function openRedeemItem(invRow) {
  openShopOverlay(`
    <div class="shop-card">
      <div class="shop-card-close" onclick="closeShopOverlay()">✕</div>
      <div class="shop-card-name">核銷確認</div>
      <div class="shop-item-desc">請將手機交給店家人員，由店家輸入核銷代碼以確認使用</div>
      <input type="text" id="redeem-passcode" class="redeem-input" placeholder="工作人員通關密語">
      <div class="redeem-error" id="redeem-error"></div>
      <button class="shop-buy-btn" onclick="submitRedeemItem(${invRow})">確認核銷</button>
    </div>
  `);
}

async function submitRedeemItem(invRow) {
  const code = document.getElementById("redeem-passcode").value.trim();
  const errEl = document.getElementById("redeem-error");
  errEl.textContent = "";
  if (!code) return;
  try {
    const res = await apiPost({ action: "redeemItem", code: state.code, invRow, staffPasscode: code });
    if (!res.ok) { errEl.textContent = res.error || "核銷失敗，請再試一次"; return; }
    state.inventory = res.inventory || state.inventory;
    closeShopOverlay();
    renderBackpack();
  } catch (e) {
    errEl.textContent = "連線失敗，請再試一次";
  }
}

// ---------- Partner store directory (public — no login required) ----------

let storesReturnScreen = "screen-login";
let storesCache = null;

function openStores() {
  const current = document.querySelector(".screen.active");
  if (current) storesReturnScreen = current.id;
  showScreen("screen-stores");
  renderStores();
}

function closeStores() {
  showScreen(storesReturnScreen);
}

async function renderStores() {
  const list = document.getElementById("stores-list");
  if (storesCache) {
    list.innerHTML = storesCache.map(storeCardHTML).join("") || `<div class="stores-empty">目前尚未公布合作店家</div>`;
    return;
  }
  list.innerHTML = `<div class="stores-empty">載入中...</div>`;
  try {
    const res = await apiGet({ action: "stores" });
    if (!res.ok) {
      list.innerHTML = `<div class="stores-empty">${res.error || "載入失敗，請稍後再試"}</div>`;
      return;
    }
    storesCache = res.stores || [];
    list.innerHTML = storesCache.map(storeCardHTML).join("") || `<div class="stores-empty">目前尚未公布合作店家</div>`;
  } catch (e) {
    list.innerHTML = `<div class="stores-empty">連線失敗，請檢查網路後再試一次</div>`;
  }
}

function storeCardHTML(s) {
  const photo = s.photo
    ? `<div class="store-photo" style="background-image:url('${encodeURI(s.photo)}')"></div>`
    : "";
  const mapBtn = s.mapUrl
    ? `<a class="store-map-btn" href="${encodeURI(s.mapUrl)}" target="_blank" rel="noopener">📍 開啟地圖導航</a>`
    : "";
  return `
    <div class="store-card">
      ${photo}
      <div class="store-body">
        <div class="store-name">${s.name}</div>
        ${s.offer ? `<div class="store-offer">🎁 ${s.offer}</div>` : ""}
        ${s.address ? `<div class="store-row">📍 ${s.address}</div>` : ""}
        ${s.phone ? `<div class="store-row">📞 ${s.phone}</div>` : ""}
        ${s.hours ? `<div class="store-row">🕒 ${s.hours}</div>` : ""}
        ${mapBtn}
      </div>
    </div>
  `;
}

let currentStationId = null;

function openStation(id) {
  currentStationId = id;
  const st = STATIONS.find(s => s.id === id);
  const done = !!state.progress[id];
  if (st.location && !done) {
    openArrivalGate(st);
    return;
  }
  enterStationContent(st);
}

function enterStationContent(st) {
  const done = !!state.progress[st.id];
  if (st.dialogue && !done) {
    openStationRPG(st);
    return;
  }
  document.getElementById("station-title").textContent = "NO. " + String(st.id).padStart(2, "0") + "　" + st.name.replace(/^站點[一二三四五六七八九十]+\s*/, "");
  showScreen("screen-station");
  renderStation(st);
}

// ---------- Arrival gate: navigate there via Google Maps, unlock once GPS confirms you're close ----------

let arriveState = null;

function openArrivalGate(st) {
  currentStationId = st.id;
  localStorage.setItem("yingge_pending_arrival", st.id);
  arriveState = { st, watchId: null };
  document.getElementById("arrive-title").textContent = "NO. " + String(st.id).padStart(2, "0") + "　" + st.name.replace(/^站點[一二三四五六七八九十]+\s*/, "");
  document.getElementById("arrive-name").textContent = st.name.replace(/^站點[一二三四五六七八九十]+/, "");
  document.getElementById("arrive-hint").textContent = st.arriveHint
    || (st.address ? `請實際前往「${st.address}」附近，抵達後即可開始遊戲` : "請實際前往站點，抵達後即可開始遊戲");
  const photoEl = document.getElementById("arrive-photo");
  const iconEl = document.getElementById("arrive-icon");
  const arrivePhoto = st.arrivePhoto || st.background;
  if (arrivePhoto) {
    photoEl.style.backgroundImage = `url("${encodeURI(arrivePhoto)}")`;
    photoEl.style.display = "block";
    iconEl.style.display = "none";
  } else {
    photoEl.style.display = "none";
    iconEl.style.display = "block";
  }
  const startBtn = document.getElementById("arrive-start-btn");
  startBtn.disabled = true;
  startBtn.textContent = "抵達後即可開始關卡";
  setArriveStatus("定位中...", "");
  showScreen("screen-arrive");
  startWatchingLocation(st);
}

function startWatchingLocation(st) {
  if (!navigator.geolocation) {
    setArriveStatus("此裝置或瀏覽器不支援定位，請確認已實際抵達後，改用下方連結手動開始", "error");
    return;
  }
  arriveState.watchId = navigator.geolocation.watchPosition(
    pos => handleLocationUpdate(st, pos),
    err => setArriveStatus("無法取得定位（" + (err.message || "權限被拒") + "），請確認已抵達後，改用下方連結手動開始", "error"),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

function handleLocationUpdate(st, pos) {
  const dist = haversineMeters(pos.coords.latitude, pos.coords.longitude, st.location.lat, st.location.lng);
  const radius = st.location.radius || 60;
  const startBtn = document.getElementById("arrive-start-btn");
  if (dist <= radius) {
    setArriveStatus(" 你已經抵達現場！可以開始關卡了", "near");
    startBtn.disabled = false;
    startBtn.textContent = "開始關卡";
  } else {
    setArriveStatus(`距離目標約 ${Math.round(dist)} 公尺，再靠近一點`, "far");
    startBtn.disabled = true;
    startBtn.textContent = "抵達後即可開始關卡";
  }
}

function setArriveStatus(text, cls) {
  const el = document.getElementById("arrive-status");
  el.textContent = text;
  el.className = "arrive-status" + (cls ? " " + cls : "");
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function openGoogleNav() {
  const st = arriveState.st;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${st.location.lat},${st.location.lng}&travelmode=walking`;
  window.open(url, "_blank");
}

function confirmArrivalAndStart() {
  const st = arriveState.st;
  localStorage.removeItem("yingge_pending_arrival");
  stopWatchingLocation();
  enterStationContent(st);
}

// ---------- Test-only: simulate a GPS reading without physically travelling there ----------

function simulateAtStation() {
  if (!arriveState) return;
  stopWatchingLocation(); // stop the real GPS watcher so it can't overwrite the simulated reading
  const st = arriveState.st;
  handleLocationUpdate(st, { coords: { latitude: st.location.lat, longitude: st.location.lng } });
}

function simulateFarAway() {
  if (!arriveState) return;
  stopWatchingLocation();
  const st = arriveState.st;
  handleLocationUpdate(st, { coords: { latitude: st.location.lat + 0.01, longitude: st.location.lng } });
}

function simulateCustom() {
  if (!arriveState) return;
  const raw = document.getElementById("debug-latlng").value;
  const parts = raw.split(",").map(s => parseFloat(s.trim()));
  if (parts.length !== 2 || parts.some(isNaN)) {
    alert("請輸入「緯度, 經度」格式，例如 24.964834, 121.255782");
    return;
  }
  const [lat, lng] = parts;
  stopWatchingLocation();
  const st = arriveState.st;
  handleLocationUpdate(st, { coords: { latitude: lat, longitude: lng } });
}

function stopWatchingLocation() {
  if (arriveState && arriveState.watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(arriveState.watchId);
  }
  if (arriveState) arriveState.watchId = null;
}

function goToMap() { localStorage.removeItem("yingge_pending_arrival"); stopWatchingLocation(); showMap(); }

function renderStation(st) {
  const container = document.getElementById("station-content");
  const done = !!state.progress[st.id];
  container.innerHTML = "";

  const header = document.createElement("div");
  header.innerHTML = `<h2 style="margin:0 0 4px;font-size:18px;">${st.name.replace(/^站點[一二三四五六七八九十]+/, "")}</h2>` +
    (done ? `<div class="q-done-tag">✓ 本站已完成</div>` : `<p style="color:var(--sub);font-size:13px;margin:0 0 14px;">請依序回答以下 ${st.questions.length} 題，全部答對即完成本站</p>`);
  container.appendChild(header);

  if (st.image) {
    const img = document.createElement("img");
    img.src = st.image;
    img.alt = st.name;
    img.className = "station-image";
    container.appendChild(img);
  }

  if (st.story) {
    const storyEl = document.createElement("div");
    storyEl.className = "story-block";
    storyEl.innerHTML = st.story + `<span class="speak-btn" onclick="speak(${JSON.stringify(st.story)})">🔊</span>`;
    container.appendChild(storyEl);
  }

  st.questions.forEach((q, idx) => {
    const block = document.createElement("div");
    block.className = "q-block";
    block.id = `q-${st.id}-${idx}`;
    block.innerHTML = renderQuestionInner(st, idx, q, done);
    container.appendChild(block);
  });
}

function speakQuestion(stationId, idx) {
  const st = STATIONS.find(s => s.id === stationId);
  const q = st.questions[idx];
  let text = q.question;
  if (q.options && q.options.length) {
    text += "" + q.options.map((opt, i) => `選項${i + 1}：${opt}`).join("");
  }
  speak(text);
}

function renderQuestionInner(st, idx, q, forceLocked) {
  let inner = `<div class="q-title">第 ${idx + 1} 題　${q.qtype}<span class="speak-btn" onclick="speakQuestion(${st.id}, ${idx})">🔊</span></div><div class="q-text">${q.question}</div>`;
  if (q.multi) {
    inner += `<div class="multi-options" id="opts-${st.id}-${idx}">` + q.options.map((opt, i) => `
      <label class="option-check">
        <input type="checkbox" id="chk-${st.id}-${idx}-${i}" value="${escapeAttr(opt)}" ${forceLocked ? "disabled" : ""}>
        <span>${opt}</span>
      </label>`).join("") + `</div>
      <button type="button" class="multi-submit-btn" onclick="submitMulti(${st.id}, ${idx})" ${forceLocked ? "disabled" : ""}>送出</button>`;
  } else if (q.options && q.options.length) {
    inner += q.options.map(opt => {
      const cls = forceLocked ? "option-btn disabled" : "option-btn";
      return `<button type="button" class="${cls}" onclick="submitOption(${st.id}, ${idx}, this, '${escapeAttr(opt)}')">${opt}</button>`;
    }).join("");
  } else {
    inner += `<div class="fill-row">
      <input type="text" id="fill-${st.id}-${idx}" placeholder="輸入答案" ${forceLocked ? "disabled" : ""}>
      <button type="button" onclick="submitFill(${st.id}, ${idx})" ${forceLocked ? "disabled" : ""}>送出</button>
    </div>`;
  }
  inner += `<div class="q-feedback" id="fb-${st.id}-${idx}"></div>`;
  if (q.fact) {
    inner += `<div class="fact-box" id="fact-${st.id}-${idx}" style="display:${forceLocked ? "block" : "none"}">💡 ${q.fact}</div>`;
  }
  return inner;
}

function revealFact(stationId, idx) {
  const el = document.getElementById(`fact-${stationId}-${idx}`);
  if (el) el.style.display = "block";
}

function escapeAttr(s) { return s.replace(/'/g, "\\'"); }

async function submitOption(stationId, idx, btnEl, chosen) {
  const st = STATIONS.find(s => s.id === stationId);
  const allBtns = btnEl.parentElement.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.classList.add("disabled"));
  setFeedback(stationId, idx, null, "判斷中…");
  let res;
  try {
    res = await apiPost({ action: "submitAnswer", code: state.code, stationId, qIndex: idx, answer: chosen });
  } catch (e) {
    allBtns.forEach(b => b.classList.remove("disabled"));
    setFeedback(stationId, idx, false, "連線失敗，請再試一次");
    return;
  }
  if (!res.ok) {
    allBtns.forEach(b => b.classList.remove("disabled"));
    setFeedback(stationId, idx, false, res.error || "發生錯誤，請再試一次");
    return;
  }
  if (res.correct) {
    btnEl.classList.add("correct");
    setFeedback(stationId, idx, true, "答對了！");
    revealFact(stationId, idx);
    checkStationComplete(st);
  } else {
    btnEl.classList.add("wrong");
    setFeedback(stationId, idx, false, "答錯了，再試一次");
    setTimeout(() => { allBtns.forEach(b => b.classList.remove("disabled", "wrong")); setFeedback(stationId, idx, null, ""); }, 900);
  }
}

async function submitMulti(stationId, idx) {
  const st = STATIONS.find(s => s.id === stationId);
  const optsEl = document.getElementById(`opts-${stationId}-${idx}`);
  const checked = Array.from(optsEl.querySelectorAll("input[type=checkbox]:checked")).map(c => c.value);
  if (!checked.length) {
    setFeedback(stationId, idx, false, "請至少勾選一個選項");
    return;
  }
  const checkboxes = optsEl.querySelectorAll("input[type=checkbox]");
  const submitBtn = document.querySelector(`#q-${stationId}-${idx} .multi-submit-btn`);
  checkboxes.forEach(c => { c.disabled = true; });
  if (submitBtn) submitBtn.disabled = true;
  setFeedback(stationId, idx, null, "判斷中…");
  let res;
  try {
    res = await apiPost({ action: "submitAnswer", code: state.code, stationId, qIndex: idx, answer: checked });
  } catch (e) {
    checkboxes.forEach(c => { c.disabled = false; });
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, "連線失敗，請再試一次");
    return;
  }
  if (!res.ok) {
    checkboxes.forEach(c => { c.disabled = false; });
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, res.error || "發生錯誤，請再試一次");
    return;
  }
  if (res.correct) {
    setFeedback(stationId, idx, true, "答對了！");
    revealFact(stationId, idx);
    checkStationComplete(st);
  } else {
    checkboxes.forEach(c => { c.disabled = false; });
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, "答錯了，再試一次");
  }
}

async function submitFill(stationId, idx) {
  const st = STATIONS.find(s => s.id === stationId);
  const input = document.getElementById(`fill-${stationId}-${idx}`);
  const submitBtn = document.querySelector(`#q-${stationId}-${idx} button`);
  const answer = input.value;
  input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  setFeedback(stationId, idx, null, "判斷中…");
  let res;
  try {
    res = await apiPost({ action: "submitAnswer", code: state.code, stationId, qIndex: idx, answer });
  } catch (e) {
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, "連線失敗，請再試一次");
    return;
  }
  if (!res.ok) {
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, res.error || "發生錯誤，請再試一次");
    return;
  }
  if (res.correct) {
    setFeedback(stationId, idx, true, "答對了！");
    revealFact(stationId, idx);
    checkStationComplete(st);
  } else {
    input.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
    setFeedback(stationId, idx, false, "答錯了，再試一次");
  }
}

function setFeedback(stationId, idx, ok, text) {
  const el = document.getElementById(`fb-${stationId}-${idx}`);
  el.textContent = text;
  el.className = "q-feedback" + (ok === true ? " correct" : ok === false ? " wrong" : "");
}

function checkStationComplete(st) {
  // check if every question block on screen shows a correct feedback
  let allCorrect = true;
  st.questions.forEach((q, idx) => {
    const fb = document.getElementById(`fb-${st.id}-${idx}`);
    if (!fb || !fb.classList.contains("correct")) allCorrect = false;
  });
  if (allCorrect) markStationComplete(st);
}

async function markStationComplete(st) {
  const wasAlreadyDone = !!state.progress[st.id];
  if (wasAlreadyDone) return true;
  try {
    const res = await apiPost({ action: "complete", code: state.code, stationId: st.id });
    if (!res.ok) {
      alert(res.error || "尚未完成所有題目，請確認後再試一次");
      return false;
    }
    loadPlayerIntoState(res);
    setTimeout(() => afterStationComplete(), 500);
    return true;
  } catch (e) {
    alert("連線失敗，請檢查網路後再試一次");
    return false;
  }
}

// ---------- RPG dialogue scene (time-travel station experience) ----------

let rpgState = null;

function openStationRPG(st) {
  currentStationId = st.id;
  rpgState = { st, idx: 0, typing: false, typeTimer: null, resultsByQ: {}, wrongCount: 0, advanceAfterReaction: false, showingReaction: false };
  showScreen("screen-rpg");
  renderRpgBackground(st.background);
  renderRpgProgress();
  renderRpgStep();
}

// Optional real background photo: set st.background = "images/xxx.jpg" to use it (falls back to
// the CSS silhouette scene when not provided). Any dialogue step can also carry its own
// "background" field to switch the scene photo mid-station — e.g. moving from the outdoor
// track scene to the front-station building — and that switch crossfades instead of cutting.
let rpgCurrentBackground = null;
function renderRpgBackground(src, opts) {
  const smooth = !!(opts && opts.smooth);
  const scene = document.getElementById("rpg-scene");
  let photoEl = document.getElementById("rpg-bg-photo");
  if (src) {
    const newUrl = `url("${encodeURI(src)}")`;
    if (!photoEl) {
      photoEl = document.createElement("div");
      photoEl.id = "rpg-bg-photo";
      photoEl.className = "rpg-bg-photo";
      scene.insertBefore(photoEl, scene.firstChild);
      photoEl.style.backgroundImage = newUrl;
    } else if (smooth && photoEl.style.backgroundImage !== newUrl) {
      const fadeEl = document.createElement("div");
      fadeEl.className = "rpg-bg-photo rpg-bg-photo-fade";
      fadeEl.style.backgroundImage = newUrl;
      photoEl.insertAdjacentElement("afterend", fadeEl);
      requestAnimationFrame(() => { fadeEl.style.opacity = "1"; });
      setTimeout(() => {
        photoEl.style.backgroundImage = newUrl;
        fadeEl.remove();
      }, 650);
    } else {
      photoEl.style.backgroundImage = newUrl;
    }
    scene.classList.add("has-photo");
  } else {
    if (photoEl) photoEl.remove();
    scene.classList.remove("has-photo");
  }
  rpgCurrentBackground = src || null;
}

// Optional character portraits: define st.characters = { guide: {name, portrait, side}, hero: {...} }
// and reference them per dialogue step via step.char = "guide" (falls back to plain step.speaker text if unset).
function renderRpgCharacters(step) {
  const chars = (rpgState.st.characters) || {};
  ["left", "right"].forEach(side => {
    const slot = document.getElementById("rpg-char-" + side);
    const entry = Object.entries(chars).find(([, c]) => c.side === side);
    if (!entry || !entry[1].portrait) {
      slot.classList.add("hidden");
      slot.classList.remove("dim", "active");
      slot.style.backgroundImage = "";
      return;
    }
    const [id, c] = entry;
    slot.classList.remove("hidden");
    slot.style.backgroundImage = `url("${encodeURI(c.portrait)}")`;
    const isActive = step.char === id;
    slot.classList.toggle("active", isActive);
    slot.classList.toggle("dim", !isActive);
  });
}

function renderRpgProgress() {
  if (!rpgState) return;
  const total = rpgState.st.questions.length;
  const done = Object.keys(rpgState.resultsByQ).length;
  const el = document.getElementById("rpg-progress");
  el.innerHTML = Array.from({ length: total }).map((_, i) =>
    `<span class="hole${i < done ? " punched" : ""}"></span>`
  ).join("");
}

// shows a "圖片載入中…" placeholder while a dialogue image is still fetching, since on a
// slow connection the surrounding text/card can appear well before the photo does
function setImgWithLoading(imgEl, loadingId, src) {
  const loadingEl = document.getElementById(loadingId);
  imgEl.style.display = "none";
  loadingEl.style.display = "block";
  const done = () => { loadingEl.style.display = "none"; imgEl.style.display = "block"; };
  imgEl.onload = done;
  imgEl.onerror = done;
  imgEl.src = src;
  if (imgEl.complete && imgEl.naturalWidth > 0) done();
}

function escapeHtmlText(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const RPG_NOTICE_PIN_SVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.16 11.16 7.02 11.94a1.5 1.5 0 0 0 1.96 0C13.84 21.16 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="currentColor"/><circle cx="12" cy="10" r="3" fill="var(--yellow)"/></svg>';

// notice text authoring convention: a line starting with ⚠️ becomes its own callout box instead
// of part of the heading; a line wrapped in 【...】 becomes its own pin-icon sub-line instead of
// showing the literal brackets; ==phrase== anywhere in the heading gets a highlighter mark
function renderNoticeText(raw) {
  const lines = (raw || "").split("\n");
  const warnLines = [];
  const headingLines = [];
  lines.forEach(line => {
    if (line.trim().startsWith("⚠️")) warnLines.push(line.trim().replace(/^⚠️\s*/, ""));
    else headingLines.push(line);
  });
  const headingHtml = headingLines.map(line => {
    const subMatch = line.match(/^【(.+)】$/);
    const inner = escapeHtmlText(subMatch ? subMatch[1] : line).replace(/==(.+?)==/g, "<mark>$1</mark>");
    return subMatch
      ? `<div class="rpg-notice-subline">${RPG_NOTICE_PIN_SVG}<span>${inner}</span></div>`
      : `<div class="rpg-notice-line">${inner}</div>`;
  }).join("");
  return { headingHtml, warnText: warnLines.join(" ") };
}

// 語音朗讀用：把 notice 文字裡的排版符號（==強調==、【子行】、⚠️）去掉，只留下純文字內容，
// 不然唸出來會把 == 【 】 這些符號整段唸出來
function noticeTextForSpeech(raw) {
  return (raw || "")
    .split("\n")
    .map(line => line.trim().replace(/^⚠️\s*/, ""))
    .map(line => {
      const subMatch = line.match(/^【(.+)】$/);
      return subMatch ? subMatch[1] : line;
    })
    .map(line => line.replace(/==(.+?)==/g, "$1"))
    .filter(Boolean)
    .join("，");
}

function renderRpgStep() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel(); // stop last step's TTS before showing the next one
  const step = rpgState.st.dialogue[rpgState.idx];
  if (step.background !== undefined && step.background !== rpgCurrentBackground) {
    renderRpgBackground(step.background, { smooth: true });
  }
  const speakerEl = document.getElementById("rpg-speaker");
  const textEl = document.getElementById("rpg-text");
  const choicesEl = document.getElementById("rpg-choices");
  const continueEl = document.getElementById("rpg-continue");
  const noticeEl = document.getElementById("rpg-notice-overlay");
  const photoEl = document.getElementById("rpg-photo-overlay");
  const findBtn = document.getElementById("rpg-find-btn");
  const knowledgeEl = document.getElementById("rpg-knowledge-overlay");
  const storyEl = document.getElementById("rpg-story-overlay");
  const gpsEl = document.getElementById("rpg-gps-overlay");
  choicesEl.innerHTML = "";
  continueEl.style.display = "none";
  findBtn.style.display = "none";
  document.getElementById("rpg-wrong-hint").classList.remove("active");
  noticeEl.classList.remove("active");
  knowledgeEl.classList.remove("active");
  storyEl.classList.remove("active");
  gpsEl.classList.remove("active");
  if (step.type !== "photo" && step.type !== "find") photoEl.classList.remove("active");

  if (step.type === "end") {
    speakerEl.textContent = "";
    textEl.textContent = "通關中...";
    finishRpgStation();
    return;
  }

  if (step.type === "notice") {
    const { headingHtml, warnText } = renderNoticeText(step.text);
    document.getElementById("rpg-notice-text").innerHTML = headingHtml;
    const warnEl = document.getElementById("rpg-notice-warn");
    if (warnText) {
      document.getElementById("rpg-notice-warn-text").textContent = warnText;
      warnEl.style.display = "flex";
    } else {
      warnEl.style.display = "none";
    }
    const noticeImgEl = document.getElementById("rpg-notice-img");
    if (step.photo) {
      setImgWithLoading(noticeImgEl, "rpg-notice-loading", step.photo);
    } else {
      noticeImgEl.style.display = "none";
      document.getElementById("rpg-notice-loading").style.display = "none";
    }
    noticeEl.classList.add("active");
    if (autoSpeak) speak(noticeTextForSpeech(step.text));
    return;
  }

  if (step.type === "gpscheck") {
    rpgState.gpsAttempts = 0;
    document.getElementById("rpg-gps-text").textContent = step.text;
    document.getElementById("rpg-gps-status").textContent = "";
    document.getElementById("rpg-gps-retry-btn").disabled = false;
    document.getElementById("rpg-gps-retry-btn").textContent = "重新定位";
    gpsEl.classList.add("active");
    if (autoSpeak) speak(step.text);
    return;
  }

  if (step.type === "knowledge") {
    const imgEl = document.getElementById("rpg-knowledge-img");
    const cardEl = document.getElementById("rpg-knowledge-card");
    const badgeEl = document.getElementById("rpg-knowledge-badge");
    // 「探索發現」還是「小知識」是看有沒有標題（有名字的東西 vs. 隨手補充的小知識），
    // 不是看有沒有照片——小知識一樣可以配照片，只是卡片風格比較輕、沒有大標題
    const isCollection = !!step.title;
    cardEl.classList.toggle("brief", !isCollection);
    if (step.photo) {
      setImgWithLoading(imgEl, "rpg-knowledge-loading", step.photo);
    } else {
      imgEl.style.display = "none";
      document.getElementById("rpg-knowledge-loading").style.display = "none";
    }
    // 兩種卡片的徽章都固定在右上角（同一個位置），只有顏色跟文字不同
    badgeEl.classList.add("corner");
    badgeEl.classList.toggle("discover", isCollection);
    if (isCollection) {
      badgeEl.textContent = "探索發現";
    } else {
      badgeEl.textContent = "小知識";
    }
    document.getElementById("rpg-knowledge-title").textContent = step.title || "";
    document.getElementById("rpg-knowledge-text").textContent = step.text || "";
    knowledgeEl.classList.add("active");
    if (autoSpeak) speak((step.title ? step.title + "。" : "") + (step.text || ""));
    return;
  }

  if (step.type === "story") {
    const imgEl = document.getElementById("rpg-story-img");
    if (step.photo) {
      setImgWithLoading(imgEl, "rpg-story-loading", step.photo);
    } else {
      imgEl.style.display = "none";
      document.getElementById("rpg-story-loading").style.display = "none";
    }
    document.getElementById("rpg-story-text").textContent = step.text || "";
    storyEl.classList.add("active");
    if (autoSpeak) speak(step.text || "");
    return;
  }

  const charDef = step.char && rpgState.st.characters && rpgState.st.characters[step.char];
  speakerEl.textContent = (charDef && charDef.name) || step.speaker || "";
  renderRpgCharacters(step);
  rpgState.advanceAfterReaction = false;
  rpgState.showingReaction = false;
  if ((step.type === "photo" || step.type === "find") && step.photo) {
    setImgWithLoading(document.getElementById("rpg-photo-img"), "rpg-photo-loading", step.photo);
    document.getElementById("rpg-photo-cap").textContent = step.caption || "";
    photoEl.classList.add("active");
  }
  typeText(textEl, step.text, () => {
    if (step.type === "line" || step.type === "photo") {
      continueEl.style.display = "block";
    } else if (step.type === "find") {
      findBtn.style.display = "block";
    } else if (step.type === "question") {
      renderRpgQuestion(step);
    }
    if (autoSpeak && step.type === "question") speakRpgCurrent();
  });
  if (autoSpeak && step.type !== "question") speak(step.text);
}

function speakRpgCurrent() {
  if (!rpgState) return;
  let text = rpgState.currentFullText || document.getElementById("rpg-text").textContent;
  const optionBtns = document.querySelectorAll("#rpg-choices .ticket-choice");
  if (optionBtns.length) {
    const opts = Array.from(optionBtns).map((b, i) => `選項${i + 1}：${b.textContent}`).join("");
    text = text + "" + opts;
  }
  speak(text);
}

// auto-speak setting: off by default, persisted so the player's choice sticks across visits.
// the "音效設定" topbar button opens a small settings card with a switch (clearer than a silent
// toggle-on-tap) — flipping the switch turns auto-narration on/off, and turning it off cancels
// whatever is currently playing and goes back to fully silent.
let autoSpeak = localStorage.getItem("yingge_auto_speak") === "1";
function updateSpeakBtnUI() {
  const btn = document.getElementById("rpg-speak-btn");
  if (!btn) return;
  btn.classList.toggle("active", autoSpeak);
  btn.title = autoSpeak ? "自動語音：開啟" : "自動語音：關閉";
}
function openVoiceSettings() {
  const sw = document.getElementById("rpg-voice-switch");
  if (sw) sw.checked = autoSpeak;
  document.getElementById("rpg-voice-overlay").classList.add("active");
}
function closeVoiceSettings() {
  document.getElementById("rpg-voice-overlay").classList.remove("active");
}
function onVoiceSwitchChange(checked) {
  autoSpeak = checked;
  localStorage.setItem("yingge_auto_speak", autoSpeak ? "1" : "0");
  updateSpeakBtnUI();
  if (autoSpeak) speakRpgCurrent();
  else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
updateSpeakBtnUI();

function typeText(el, text, onDone) {
  el.textContent = "";
  rpgState.currentFullText = text;
  rpgState.typing = true;
  let i = 0;
  clearInterval(rpgState.typeTimer);
  rpgState.typeTimer = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(rpgState.typeTimer);
      rpgState.typing = false;
      if (onDone) onDone();
    }
  }, 26);
}

function skipTyping() {
  clearInterval(rpgState.typeTimer);
  rpgState.typing = false;
  const step = rpgState.st.dialogue[rpgState.idx];

  if (rpgState.showingReaction) {
    // mid-typing on the post-answer reaction text, not the original question — just finish it,
    // never fall back to re-rendering the question's options
    document.getElementById("rpg-text").textContent = step.correctReaction;
    rpgState.advanceAfterReaction = true;
    document.getElementById("rpg-continue").style.display = "block";
    return;
  }

  document.getElementById("rpg-text").textContent = step.text;
  if (step.type === "line" || step.type === "photo") {
    document.getElementById("rpg-continue").style.display = "block";
  } else if (step.type === "find") {
    document.getElementById("rpg-find-btn").style.display = "block";
  } else if (step.type === "question") {
    renderRpgQuestion(step);
  }
}

function showFactCard(fact) {
  document.getElementById("rpg-knowledge-card").classList.add("brief");
  document.getElementById("rpg-knowledge-img").style.display = "none";
  document.getElementById("rpg-knowledge-loading").style.display = "none";
  const badgeEl = document.getElementById("rpg-knowledge-badge");
  badgeEl.classList.add("corner");
  badgeEl.classList.remove("discover");
  badgeEl.textContent = "小知識";
  document.getElementById("rpg-knowledge-title").textContent = "";
  document.getElementById("rpg-knowledge-text").textContent = fact;
  document.getElementById("rpg-knowledge-overlay").classList.add("active");
  if (autoSpeak) speak(fact);
}

function advanceRpg() {
  if (!rpgState) return;
  const step = rpgState.st.dialogue[rpgState.idx];
  if (rpgState.typing) { skipTyping(); return; }
  if (step.type === "question" && !rpgState.advanceAfterReaction) return;
  if (step.type === "find") return; // only the "找到了" button may advance this step
  if (step.type === "gpscheck") return; // only a successful retry may advance this step
  if (rpgState.pendingFact) {
    // answering correctly just finished; show the fact as its own knowledge card
    // before moving on, instead of burying it inside the dialogue text
    const fact = rpgState.pendingFact;
    rpgState.pendingFact = null;
    showFactCard(fact);
    return;
  }
  rpgState.idx++;
  renderRpgStep();
}

function confirmFound() {
  if (!rpgState) return;
  if (rpgState.typing) { skipTyping(); return; }
  rpgState.idx++;
  renderRpgStep();
}

// mid-story GPS re-check (e.g. "did you actually climb up to 鶯歌石, not just the trailhead?").
// button-triggered (not a continuous watch, unlike the arrival gate) — each tap is one attempt,
// with a cooldown between taps so repeated attempts can't be reached by spam-tapping in a few
// seconds. No self-serve bypass for now — a player who genuinely can't get a GPS fix here just
// has to keep retrying (or ask a staff member to help in person).
const GPS_RETRY_COOLDOWN_MS = 8000;
function retryGpsCheck() {
  if (!rpgState) return;
  const step = rpgState.st.dialogue[rpgState.idx];
  if (!step || step.type !== "gpscheck") return;
  const statusEl = document.getElementById("rpg-gps-status");
  const retryBtn = document.getElementById("rpg-gps-retry-btn");
  if (!navigator.geolocation) {
    statusEl.textContent = "此裝置或瀏覽器不支援定位";
    return;
  }
  retryBtn.disabled = true;
  statusEl.textContent = "定位中...";
  navigator.geolocation.getCurrentPosition(
    pos => {
      const dist = haversineMeters(pos.coords.latitude, pos.coords.longitude, step.location.lat, step.location.lng);
      const radius = step.location.radius || 30;
      if (dist <= radius) {
        rpgState.idx++;
        renderRpgStep();
        return;
      }
      statusEl.textContent = `距離還差約 ${Math.round(dist)} 公尺，再靠近一點`;
      rpgState.gpsAttempts = (rpgState.gpsAttempts || 0) + 1;
      startGpsRetryCooldown(retryBtn);
    },
    err => {
      statusEl.textContent = "無法取得定位（" + (err.message || "權限被拒") + "）";
      rpgState.gpsAttempts = (rpgState.gpsAttempts || 0) + 1;
      startGpsRetryCooldown(retryBtn);
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

// test-only: simulate a successful arrival without real GPS, for testing indoors / at a desk
function simulateGpsArrived() {
  if (!rpgState) return;
  const step = rpgState.st.dialogue[rpgState.idx];
  if (!step || step.type !== "gpscheck") return;
  rpgState.idx++;
  renderRpgStep();
}

function startGpsRetryCooldown(retryBtn) {
  let remaining = Math.ceil(GPS_RETRY_COOLDOWN_MS / 1000);
  retryBtn.disabled = true;
  retryBtn.textContent = `重新定位（${remaining}）`;
  const timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(timer);
      retryBtn.disabled = false;
      retryBtn.textContent = "重新定位";
    } else {
      retryBtn.textContent = `重新定位（${remaining}）`;
    }
  }, 1000);
}

function renderRpgQuestion(step) {
  const q = rpgState.st.questions[step.qIndex];
  const choicesEl = document.getElementById("rpg-choices");
  if (q.multi) {
    choicesEl.innerHTML = `<div class="rpg-multi-options">` + q.options.map((opt, i) => `
      <label class="rpg-option-check">
        <input type="checkbox" id="rpg-chk-${step.qIndex}-${i}" value="${escapeAttr(opt)}" onchange="this.closest('.rpg-option-check').classList.toggle('checked', this.checked)">
        <span>${opt}</span>
      </label>`).join("") + `</div>
      <button type="button" class="rpg-multi-submit-btn" onclick="answerRpgMulti(${step.qIndex})">送出</button>`;
  } else if (q.options && q.options.length) {
    choicesEl.innerHTML = q.options.map(opt =>
      `<button type="button" class="ticket-choice" onclick="answerRpgQuestion(${step.qIndex}, this, '${escapeAttr(opt)}')">${opt}</button>`
    ).join("");
  } else {
    choicesEl.innerHTML = `
      <div class="ticket-fill">
        <input type="text" id="rpg-fill-input" placeholder="輸入答案">
        <button type="button" onclick="answerRpgFill(${step.qIndex})">送出</button>
      </div>`;
  }
}

function answerRpgQuestion(qIndex, btnEl, chosen) {
  submitRpgAnswer(qIndex, chosen, btnEl);
}

function answerRpgFill(qIndex) {
  const input = document.getElementById("rpg-fill-input");
  submitRpgAnswer(qIndex, input.value, null);
}

function answerRpgMulti(qIndex) {
  const checked = Array.from(document.querySelectorAll(`#rpg-choices input[type=checkbox]:checked`)).map(el => el.value);
  submitRpgAnswer(qIndex, checked, null);
}

async function submitRpgAnswer(qIndex, chosen, btnEl) {
  const choicesEl = document.getElementById("rpg-choices");
  if (btnEl) btnEl.classList.add("selected"); // immediate color feedback so the player can see what they tapped while it's checked
  choicesEl.querySelectorAll("button").forEach(b => { b.disabled = true; });
  const pending = document.createElement("div");
  pending.className = "rpg-pending";
  pending.textContent = "判斷中…";
  choicesEl.appendChild(pending);
  let res;
  try {
    res = await apiPost({ action: "submitAnswer", code: state.code, stationId: rpgState.st.id, qIndex, answer: chosen });
  } catch (e) {
    pending.remove();
    choicesEl.querySelectorAll("button").forEach(b => { b.disabled = false; });
    const hintEl = document.getElementById("rpg-wrong-hint");
    hintEl.textContent = "連線失敗，請再試一次";
    hintEl.classList.add("active");
    return;
  }
  pending.remove();
  if (!res.ok) {
    choicesEl.querySelectorAll("button").forEach(b => { b.disabled = false; });
    const hintEl = document.getElementById("rpg-wrong-hint");
    hintEl.textContent = res.error || "發生錯誤，請再試一次";
    hintEl.classList.add("active");
    return;
  }
  handleRpgAnswer(qIndex, res.correct, btnEl);
}

function handleRpgAnswer(qIndex, correct, btnEl) {
  const step = rpgState.st.dialogue[rpgState.idx];
  const choicesEl = document.getElementById("rpg-choices");
  if (correct) {
    // lock the options immediately so a second tap before the reaction starts can't re-trigger this
    choicesEl.querySelectorAll("button").forEach(b => { b.disabled = true; });
    if (btnEl) btnEl.classList.add("correct");
    rpgState.resultsByQ[qIndex] = true;
    renderRpgProgress();
    const q = rpgState.st.questions[qIndex];
    rpgState.pendingFact = q.fact || null;
    const reaction = step.correctReaction;
    setTimeout(() => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel(); // stop any TTS still reading the question before the reaction text appears
      choicesEl.innerHTML = "";
      rpgState.showingReaction = true;
      if (step.reactionBackground !== undefined && step.reactionBackground !== rpgCurrentBackground) {
        renderRpgBackground(step.reactionBackground, { smooth: true });
      }
      const textEl = document.getElementById("rpg-text");
      typeText(textEl, reaction, () => {
        rpgState.advanceAfterReaction = true;
        document.getElementById("rpg-continue").style.display = "block";
      });
      if (autoSpeak) speak(reaction);
    }, 350);
  } else {
    if (btnEl) btnEl.classList.add("wrong");
    const hints = step.wrongHints || ["再想想看……"];
    const hint = hints[Math.min(rpgState.wrongCount, hints.length - 1)];
    rpgState.wrongCount++;
    // 顯示在選項下方的獨立提示，不動題目本身的文字，這樣答錯了還是看得到原本的題目
    const hintEl = document.getElementById("rpg-wrong-hint");
    hintEl.textContent = hint;
    hintEl.classList.add("active");
    if (autoSpeak) speak(hint);
    setTimeout(() => {
      choicesEl.querySelectorAll("button").forEach(b => { b.disabled = false; });
      if (btnEl) btnEl.classList.remove("wrong", "selected");
    }, 900);
  }
}

function finishRpgStation() {
  const st = rpgState.st;
  rpgState = null;
  markStationComplete(st); // schedules afterStationComplete(), which goes back to the map
}

function exitRpgToMap() {
  if (rpgState) clearInterval(rpgState.typeTimer);
  rpgState = null;
  goToMap();
}

// 完成站點後直接回地圖；地圖上的獎章餘額會自己反映出剛拿到的獎章
function afterStationComplete() {
  goToMap();
  checkFinale();
}

// 十站全部完成時彈出一次恭喜畫面；用序號記住「已經看過」，避免玩家之後每次回地圖都被彈一次
function checkFinale() {
  if (completedCount() < STATIONS.length) return;
  const key = "yingge_finale_shown_" + state.code;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, "1");
  document.getElementById("finale-title").textContent = `恭喜「${state.name || ""}」成功闖完所有關卡！`;
  document.getElementById("finale-text").textContent =
    "你已完成所有探索，\n也發現了藏在鶯歌各處的故事。\n恭喜完成這趟鶯歌探索之旅！";
  document.getElementById("finale-overlay").classList.add("active");
}

function closeFinaleOverlay() {
  document.getElementById("finale-overlay").classList.remove("active");
}

// stay logged in across page refreshes (until the 15-minute idle timeout above):
// auto re-login with the last used code as soon as the script runs, without waiting for full page load
(async () => {
  const last = localStorage.getItem("yingge_last_code");
  if (!last) return;
  document.getElementById("code-input").value = last;
  const errEl = document.getElementById("login-error");
  try {
    const res = await apiGet({ action: "login", code: last });
    if (!res.ok) {
      // saved code no longer valid server-side — drop it and fall back to the login form
      localStorage.removeItem("yingge_last_code");
      document.getElementById("login-card").style.display = "";
      document.getElementById("login-restoring").style.display = "none";
      return;
    }
    state.code = res.code;
    loadPlayerIntoState(res);
    errEl.textContent = "";
    resetIdleTimer();
    const pendingId = localStorage.getItem("yingge_pending_arrival");
    const pendingSt = pendingId && STATIONS.find(s => String(s.id) === String(pendingId));
    if (pendingSt && !state.progress[pendingSt.id]) {
      openArrivalGate(pendingSt);
    } else {
      localStorage.removeItem("yingge_pending_arrival");
      showMap();
    }
  } catch (e) {
    document.getElementById("login-card").style.display = "";
    document.getElementById("login-restoring").style.display = "none";
  }
})();
