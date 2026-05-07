function initApp() {
  ensurePrizeGrid();
  bindEvents();
  updateCountdown();
  updateFortuneButtonState();

  setInterval(() => {
    updateCountdown();
    updateFortuneButtonState();
  }, 1000);
}

initApp();
