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
    // 如果重新整理前人正在某一站的劇情裡，直接接回那個畫面問要不要接續進度，
    // 不用先回到地圖再自己點回那一站
    const rawRpg = localStorage.getItem(RPG_PROGRESS_KEY);
    const savedRpg = rawRpg ? JSON.parse(rawRpg) : null;
    const rpgSt = savedRpg && STATIONS.find(s => s.id === savedRpg.stationId);
    const pendingId = localStorage.getItem("yingge_pending_arrival");
    const pendingSt = pendingId && STATIONS.find(s => String(s.id) === String(pendingId));
    if (rpgSt && !state.progress[rpgSt.id]) {
      openStationRPG(rpgSt);
    } else if (pendingSt && !state.progress[pendingSt.id]) {
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
