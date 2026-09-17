-- 鶯歌壯遊 D1 資料表結構
-- 對應原本 Google Sheets 的 報名人數(部分欄位) / Progress / Answers / Inventory 分頁

CREATE TABLE IF NOT EXISTS players (
  code TEXT PRIMARY KEY,          -- 遊戲序號（跟 Google Sheets 產生的序號一致）
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '', -- 給商家查看購買人資料用，從 Google 表單同步過來
  email TEXT NOT NULL DEFAULT '', -- 用 Google 帳號登入時比對用（表單「自動收集信箱」寫入的那組）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login TEXT
);

CREATE TABLE IF NOT EXISTS progress (
  code TEXT NOT NULL,
  station_id INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (code, station_id)
);

CREATE TABLE IF NOT EXISTS answers (
  code TEXT NOT NULL,
  station_id INTEGER NOT NULL,
  q_index INTEGER NOT NULL,
  answered_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (code, station_id, q_index)
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  item_id TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  bought_at TEXT NOT NULL DEFAULT (datetime('now')),
  used INTEGER NOT NULL DEFAULT 0,
  used_at TEXT
);

-- 簡易答題頻率限制（取代 GAS 版本用 CacheService 做的 rate limit）
CREATE TABLE IF NOT EXISTS rate_limits (
  code TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL, -- unix 秒數
  count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_progress_code ON progress(code);
CREATE INDEX IF NOT EXISTS idx_answers_code_station ON answers(code, station_id);
CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
