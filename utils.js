function getWeightedRandom(list) {
  const total = list.reduce((sum, item) => sum + item.rate, 0);
  let rand = Math.random() * total;

  for (const item of list) {
    rand -= item.rate;
    if (rand < 0) return item;
  }

  return list[list.length - 1];
}

function getRandomFortune() {
  return getWeightedRandom(FORTUNE_LIST);
}

function getRandomPrizeFromRange(minNo, maxNo) {
  const filtered = PRIZE_LIST.filter(item => {
    const no = Number(item.name);
    return no >= minNo && no <= maxNo;
  });
  return getWeightedRandom(filtered);
}

function getRandomQA() {
  const index = Math.floor(Math.random() * QA_LIST.length);
  return QA_LIST[index];
}

function getTodayAt(hour, minute = 0, second = 0, ms = 0) {
  const target = new Date();
  target.setHours(hour, minute, second, ms);
  return target;
}

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatTimeHM(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getCurrentDateHourKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  return `${y}-${m}-${d}-${h}`;
}

function getNextHourTime() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

function getRemainingTestSeconds(lastDrawTime) {
  const now = Date.now();
  const diff = TEST_DRAW_SECONDS * 1000 - (now - lastDrawTime);
  return Math.max(0, Math.ceil(diff / 1000));
}
