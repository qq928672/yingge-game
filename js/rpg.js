// ---------- RPG dialogue scene (time-travel station experience) ----------

let rpgState = null;

// 玩家在關卡對話中途，如果畫面被切掉、滑掉，甚至手機瀏覽器直接把分頁殺掉重載，
// 原本 rpgState 只存在記憶體裡，重新整理就會歸零，逼玩家從頭把整站劇情、題目再走一次。
// 這裡把「目前站點、講到第幾句、答對了哪幾題」存進 localStorage，重新打開同一站時
// 跳出選擇彈窗，讓玩家自己決定要接回中斷點，還是乾脆從頭開始。
const RPG_PROGRESS_KEY = "yingge_rpg_progress";
function saveRpgProgress() {
  if (!rpgState) return;
  try {
    localStorage.setItem(RPG_PROGRESS_KEY, JSON.stringify({
      stationId: rpgState.st.id,
      idx: rpgState.idx,
      resultsByQ: rpgState.resultsByQ,
      wrongCount: rpgState.wrongCount,
    }));
  } catch (e) { /* 私密模式等情境存不進去就算了，不影響遊戲本身 */ }
}
function clearRpgProgress() {
  try { localStorage.removeItem(RPG_PROGRESS_KEY); } catch (e) {}
}
function loadRpgProgress(stationId) {
  try {
    const raw = localStorage.getItem(RPG_PROGRESS_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved && saved.stationId === stationId) return saved;
  } catch (e) {}
  return null;
}

let resumePromptCtx = null;
function openStationRPG(st) {
  currentStationId = st.id;
  const saved = loadRpgProgress(st.id);
  const canResume = saved && saved.idx > 0 && saved.idx < st.dialogue.length;
  if (canResume) {
    resumePromptCtx = { st, saved };
    document.getElementById("resume-overlay").classList.add("active");
    return;
  }
  startRpgState(st, null);
}

function resumeRpgChoice(wantsResume) {
  const ctx = resumePromptCtx;
  resumePromptCtx = null;
  document.getElementById("resume-overlay").classList.remove("active");
  if (!ctx) return;
  if (!wantsResume) clearRpgProgress();
  startRpgState(ctx.st, wantsResume ? ctx.saved : null);
}

function startRpgState(st, saved) {
  rpgState = {
    st,
    idx: saved ? saved.idx : 0,
    typing: false, typeTimer: null,
    resultsByQ: saved ? saved.resultsByQ : {},
    wrongCount: saved ? saved.wrongCount || 0 : 0,
    advanceAfterReaction: false, showingReaction: false,
  };
  showScreen("screen-rpg");
  // st.background 同時也拿去當地圖卡片縮圖／抵達畫面照片用，不一定跟劇情開場的畫面一樣
  // （例如站點三縮圖用鶯歌石，但劇情是從步道入口開始）——一開始就照第一句台詞自己的
  // background 顯示，才不會先閃一下 st.background 才淡出換成正確的畫面
  const firstStep = st.dialogue[rpgState.idx] || st.dialogue[0];
  renderRpgBackground(firstStep.background || st.background);
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
  saveRpgProgress();
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
    const noticeCapEl = document.getElementById("rpg-notice-cap");
    if (step.photo) {
      setImgWithLoading(noticeImgEl, "rpg-notice-loading", step.photo);
      noticeCapEl.textContent = step.caption || "";
      noticeCapEl.style.display = step.caption ? "block" : "none";
    } else {
      noticeImgEl.style.display = "none";
      document.getElementById("rpg-notice-loading").style.display = "none";
      noticeCapEl.style.display = "none";
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
    // 老照片這種懷舊題材可以掛 vintage: true，圖片套一層淡淡的復古濾鏡，
    // 卡片本身還是原本的「探索發現／小知識」風格，只有照片濾鏡不一樣
    imgEl.classList.toggle("vintage", !!step.vintage);
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
      document.getElementById("rpg-wrong-hint").classList.remove("active"); // 答對前如果答錯過，這裡要把殘留的錯誤提示收掉，不然會跟正確反應同時顯示
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
  clearRpgProgress();
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
