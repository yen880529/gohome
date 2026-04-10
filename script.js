const PHOTO1 = "photo1.jpg";
const PHOTO2 = "photo2.jpg";

// =========================================================
// 測試模式設定
// true  = 測試模式（幾秒就能再抽一次）
// false = 正式模式（每小時只能抽一次）
// =========================================================
const TEST_MODE = true;
const TEST_DRAW_SECONDS = 0.5;

// =========================================================
// 問答圖片
// =========================================================
const QA_LIST = [
  {
    question: "你想知道我想對你說什麼嗎",
    image: "fun1.jpg"
  },
  {
    question: "晚上要來點激情嗎",
    image: "fun2.jpg"
  },
  {
    question: "你要跟我再一起一輩子嗎",
    image: "fun3.jpg"
  }
];

// =========================================================
// 運勢機率（總和 100）
// 隱藏大獎 = 1%
// 大吉     = 9%
// 吉       = 18%
// =========================================================
const FORTUNE_LIST = [
  { name: "隱藏大獎", image: "fortune0.jpg", desc: "隱藏大獎 🐱✨", rate: 100 },
  { name: "大吉", image: "fortune1.jpg", desc: "好運馬路 🐱✨", rate: 9 },
  { name: "吉", image: "fortune2.jpg", desc: "毛毛朋友幫🐱🐰", rate: 18 },
  { name: "中吉", image: "fortune3.jpg", desc: "老波妞 🐇", rate: 20 },
  { name: "小吉", image: "fortune4.jpg", desc: "水豚水豚 🌿", rate: 16 },
  { name: "末吉", image: "fortune5.jpg", desc: "懶惰馬路 🐈", rate: 14 },
  { name: "凶", image: "fortune6.jpg", desc: "神秘黑炭 ⚠️", rate: 12 },
  { name: "大凶", image: "fortune7.jpg", desc: "邪惡豆塔 😾", rate: 10 }
];

// =========================================================
// 抽獎獎項
// =========================================================
const PRIZE_LIST = [
  { name: "1", image: "prize1.jpg", rate: 1, desc: "包包獎 👜✨" },
  { name: "2", image: "prize2.jpg", rate: 3, desc: "鞋鞋衣服獎 👗🎉" },
  { name: "3", image: "prize3.jpg", rate: 3, desc: "化妝品獎 🪮🎁" },
  { name: "4", image: "prize4.jpg", rate: 6, desc: "美食獎 🍲" },
  { name: "5", image: "prize5.jpg", rate: 20, desc: "兜風獎 🚗" },
  { name: "6", image: "prize6.jpg", rate: 74, desc: "愛的抱抱老婆獎 🍀" }
];

// =========================================================
// DOM
// =========================================================
const mainPhotoEl = document.getElementById("mainPhoto");
const targetTextEl = document.getElementById("targetText");
const statusEl = document.getElementById("status");
const footerTextEl = document.getElementById("footerText");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const questionModalEl = document.getElementById("questionModal");
const resultModalEl = document.getElementById("resultModal");
const modalQuestionTextEl = document.getElementById("modalQuestionText");
const modalAnswerInputEl = document.getElementById("modalAnswerInput");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalSubmitBtn = document.getElementById("modalSubmitBtn");
const resultImageEl = document.getElementById("resultImage");
const resultCloseBtn = document.getElementById("resultCloseBtn");

const fortuneBtn = document.getElementById("fortuneBtn");
const fortuneHintEl = document.getElementById("fortuneHint");

const luckyDrawAreaEl = document.getElementById("luckyDrawArea");
const luckyDrawBtn = document.getElementById("luckyDrawBtn");
const luckyDrawStatusEl = document.getElementById("luckyDrawStatus");

// =========================================================
// 動態獎項區（給隱藏大獎 3 連抽用）
// 不用改 HTML，JS 自己插入
// =========================================================
let prizeGridEl = null;

// =========================================================
// 提醒文字
// =========================================================
const rotatingReminders = [
  "記得喝水 💧",
  "坐久屁股酸記得動動 ✨",
  "眼睛要休息 👀",
  "手腳動動 🙆",
  "深呼吸 🌿",
  "晚餐要吃啥 🐰",
];

// =========================================================
// 狀態
// =========================================================
let currentQA = null;
let currentFortune = null;

// =========================================================
// 通用工具
// =========================================================
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

function getRandomPrize() {
  return getWeightedRandom(PRIZE_LIST);
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

// =========================================================
// 結果視窗圖區管理
// =========================================================
function ensurePrizeGrid() {
  if (prizeGridEl) return prizeGridEl;

  prizeGridEl = document.createElement("div");
  prizeGridEl.id = "dynamicPrizeGrid";
  prizeGridEl.style.display = "none";
  prizeGridEl.style.width = "100%";
  prizeGridEl.style.maxWidth = "820px";
  prizeGridEl.style.margin = "18px auto 6px auto";
  prizeGridEl.style.gap = "12px";
  prizeGridEl.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
  prizeGridEl.style.alignItems = "start";

  if (resultImageEl && resultImageEl.parentNode) {
    resultImageEl.parentNode.insertBefore(prizeGridEl, resultImageEl.nextSibling);
  }

  return prizeGridEl;
}

function clearPrizeGrid() {
  const grid = ensurePrizeGrid();
  grid.innerHTML = "";
  grid.style.display = "none";

  if (resultImageEl) {
    resultImageEl.style.display = "";
    resultImageEl.style.maxWidth = "";
    resultImageEl.style.width = "";
  }
}

function showSingleResultImage(imagePath) {
  clearPrizeGrid();
  resultImageEl.src = imagePath;

  // 單張圖維持大圖
  resultImageEl.style.display = "";
  resultImageEl.style.width = "100%";
  resultImageEl.style.maxWidth = "360px";
}

function showTriplePrizeCards(prizeList) {
  const grid = ensurePrizeGrid();
  grid.innerHTML = "";
  grid.style.display = "grid";

  if (resultImageEl) {
    resultImageEl.style.display = "none";
    resultImageEl.src = "";
  }

  prizeList.forEach((prize, index) => {
    const card = document.createElement("div");
    card.style.background = "rgba(255,255,255,0.88)";
    card.style.borderRadius = "18px";
    card.style.padding = "10px";
    card.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
    card.style.textAlign = "center";

    const badge = document.createElement("div");
    badge.textContent = `第 ${index + 1} 抽`;
    badge.style.fontWeight = "800";
    badge.style.fontSize = "14px";
    badge.style.marginBottom = "8px";
    badge.style.color = "#ff4f8b";

    const img = document.createElement("img");
    img.src = prize.image;
    img.alt = `獎項 ${prize.name}`;
    img.style.width = "100%";
    img.style.maxWidth = "180px";
    img.style.height = "180px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "14px";
    img.style.display = "block";
    img.style.margin = "0 auto 10px auto";

    const title = document.createElement("div");
    title.textContent = `獎項 ${prize.name}`;
    title.style.fontSize = "18px";
    title.style.fontWeight = "900";
    title.style.marginBottom = "6px";
    title.style.color = "#ff4f8b";

    const desc = document.createElement("div");
    desc.textContent = prize.desc;
    desc.style.fontSize = "14px";
    desc.style.fontWeight = "700";
    desc.style.lineHeight = "1.5";
    desc.style.color = "#444";

    card.appendChild(badge);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    grid.appendChild(card);
  });
}

// =========================================================
// 幸運抽獎規則
// 吉       -> 4~6 抽 1 個
// 大吉     -> 1~3 抽 1 個
// 隱藏大獎 -> 1~3 連抽 3 個
// =========================================================
function getLuckyDrawConfigByFortune(fortuneName) {
  if (fortuneName === "吉") {
    return {
      mode: "single",
      buttonText: "幸運抽獎",
      prizeRange: [4, 6]
    };
  }

  if (fortuneName === "大吉") {
    return {
      mode: "single",
      buttonText: "幸運抽獎",
      prizeRange: [1, 3]
    };
  }

  if (fortuneName === "隱藏大獎") {
    return {
      mode: "triple",
      buttonText: "隱藏大獎 3連抽",
      prizeRange: [1, 3]
    };
  }

  return null;
}

// =========================================================
// 抽運勢限制
// =========================================================
function canDrawFortune() {
  if (TEST_MODE) {
    const lastDrawTime = Number(localStorage.getItem("fortune_last_draw_time") || 0);
    if (!lastDrawTime) return true;
    return (Date.now() - lastDrawTime) >= TEST_DRAW_SECONDS * 1000;
  }

  const currentHourKey = getCurrentDateHourKey();
  const lastDrawHour = localStorage.getItem("fortune_last_draw_hour");
  return lastDrawHour !== currentHourKey;
}

function updateFortuneButtonState() {
  if (TEST_MODE) {
    const lastDrawTime = Number(localStorage.getItem("fortune_last_draw_time") || 0);

    if (!lastDrawTime || canDrawFortune()) {
      fortuneBtn.disabled = false;
      fortuneHintEl.textContent = `測試模式：每 ${TEST_DRAW_SECONDS} 秒可抽一次 🧪`;
    } else {
      const remain = getRemainingTestSeconds(lastDrawTime);
      fortuneBtn.disabled = true;
      fortuneHintEl.textContent = `測試模式：請等待 ${remain} 秒後再抽 🧪`;
    }

    return;
  }

  const currentHourKey = getCurrentDateHourKey();
  const lastDrawHour = localStorage.getItem("fortune_last_draw_hour");

  if (lastDrawHour === currentHourKey) {
    const nextHour = getNextHourTime();
    fortuneBtn.disabled = true;
    fortuneHintEl.textContent = `本小時已抽過，下次可抽時間：${formatTimeHM(nextHour)} ✨`;
  } else {
    fortuneBtn.disabled = false;
    fortuneHintEl.textContent = "每個整點可抽一次 ✨";
  }
}

// =========================================================
// 倒數
// =========================================================
function getNextWorkStart() {
  const now = new Date();
  const target = new Date();

  target.setHours(8, 0, 0, 0);

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

function updatePhotoByTime(now) {
  const switchTime = getTodayAt(16, 0, 0, 0);

  if (now >= switchTime) {
    mainPhotoEl.src = PHOTO2;
  } else {
    mainPhotoEl.src = PHOTO1;
  }
}

function getReminderByFiveMinute(now) {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const index = Math.floor(totalMinutes / 5) % rotatingReminders.length;
  return rotatingReminders[index];
}

function applyThemeByTime(now) {
  const hour = now.getHours();
  const root = document.documentElement;

  if (hour >= 5 && hour < 8) {
    root.style.setProperty("--bg1", "#fff1b8");
    root.style.setProperty("--bg2", "#ffd9c9");
    root.style.setProperty("--bg3", "#ffe9f3");
    root.style.setProperty("--text-main", "#704c41");
    root.style.setProperty("--title-color", "#c06a6a");
    root.style.setProperty("--subtitle-color", "#8a625c");
    root.style.setProperty("--number-color", "#d86f7c");
    root.style.setProperty("--status-color", "#a35f6e");
    root.style.setProperty("--footer-color", "#9d7c76");
  } else if (hour >= 8 && hour < 12) {
    root.style.setProperty("--bg1", "#fff3b0");
    root.style.setProperty("--bg2", "#ffd6e7");
    root.style.setProperty("--bg3", "#d9e7ff");
    root.style.setProperty("--text-main", "#6b325e");
    root.style.setProperty("--title-color", "#b14d8a");
    root.style.setProperty("--subtitle-color", "#7a4a71");
    root.style.setProperty("--number-color", "#c94f93");
    root.style.setProperty("--status-color", "#9c4f80");
    root.style.setProperty("--footer-color", "#9b7693");
  } else if (hour >= 12 && hour < 16) {
    root.style.setProperty("--bg1", "#ffe7a8");
    root.style.setProperty("--bg2", "#ffcfcf");
    root.style.setProperty("--bg3", "#ffdff5");
    root.style.setProperty("--text-main", "#6a3b4f");
    root.style.setProperty("--title-color", "#c25a76");
    root.style.setProperty("--subtitle-color", "#84586b");
    root.style.setProperty("--number-color", "#d05b74");
    root.style.setProperty("--status-color", "#a35370");
    root.style.setProperty("--footer-color", "#9b7086");
  } else if (hour >= 16 && hour < 18) {
    root.style.setProperty("--bg1", "#ffd3a5");
    root.style.setProperty("--bg2", "#ffb7c5");
    root.style.setProperty("--bg3", "#d8c3ff");
    root.style.setProperty("--text-main", "#5e3559");
    root.style.setProperty("--title-color", "#b14d8a");
    root.style.setProperty("--subtitle-color", "#7c4f73");
    root.style.setProperty("--number-color", "#d14d87");
    root.style.setProperty("--status-color", "#9d4a7f");
    root.style.setProperty("--footer-color", "#936f92");
  } else if (hour >= 18 && hour < 22) {
    root.style.setProperty("--bg1", "#7a5fa3");
    root.style.setProperty("--bg2", "#5f5d9b");
    root.style.setProperty("--bg3", "#2e3f70");
    root.style.setProperty("--text-main", "#f8ecff");
    root.style.setProperty("--title-color", "#ffd6f2");
    root.style.setProperty("--subtitle-color", "#eedcff");
    root.style.setProperty("--number-color", "#ffb8e0");
    root.style.setProperty("--status-color", "#ffd7ef");
    root.style.setProperty("--footer-color", "#dfc7f2");
  } else {
    root.style.setProperty("--bg1", "#24324f");
    root.style.setProperty("--bg2", "#2f2b5a");
    root.style.setProperty("--bg3", "#121a33");
    root.style.setProperty("--text-main", "#edf3ff");
    root.style.setProperty("--title-color", "#cfe0ff");
    root.style.setProperty("--subtitle-color", "#d6ddff");
    root.style.setProperty("--number-color", "#ffcae7");
    root.style.setProperty("--status-color", "#e8e3ff");
    root.style.setProperty("--footer-color", "#bcc7ea");
  }
}

function updateCountdown() {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  applyThemeByTime(now);
  updatePhotoByTime(now);

  const workStart = getTodayAt(8, 0, 0, 0);
  const lunchStart = getTodayAt(12, 0, 0, 0);
  const lunchEnd = getTodayAt(13, 0, 0, 0);
  const offWork = getTodayAt(17, 0, 0, 0);
  const nextWorkStart = getNextWorkStart();

  let target = null;
  let mode = "";

  if (now >= workStart && now < lunchStart) {
    target = lunchStart;
    mode = "countdown_lunch";
  } else if (now >= lunchStart && now < lunchEnd) {
    mode = "lunch_break";
  } else if (now >= lunchEnd && now < offWork) {
    target = offWork;
    mode = "countdown_offwork";
  } else if (now >= offWork) {
    target = nextWorkStart;
    mode = "after_work_break";
  } else {
    target = workStart;
    mode = "before_work_break";
  }

  if (
    mode === "countdown_lunch" ||
    mode === "countdown_offwork" ||
    mode === "after_work_break" ||
    mode === "before_work_break"
  ) {
    const diff = target - now;
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  } else {
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
  }

  if (mode === "countdown_lunch") {
    targetTextEl.innerHTML = `午餐時間：${formatDate(target)} <span class="sparkle">🍱</span>`;

    if (currentHours === 11 && currentMinutes >= 30) {
      statusEl.textContent = "🍱 快中午了～準備吃小瓜餐🐌！";
    } else {
      statusEl.textContent = "正在倒數午餐時間 ✨";
    }

    footerTextEl.textContent = "Countdown to Lunch · 午餐倒數中";
    return;
  }

  if (mode === "lunch_break") {
    targetTextEl.innerHTML = `現在是午休時間 <span class="sparkle">🍱</span>`;
    statusEl.textContent = "午休時間到，午安馬卡巴卡 😴";
    footerTextEl.textContent = "Lunch Break · 午休時間";
    return;
  }

  if (mode === "countdown_offwork") {
    targetTextEl.innerHTML = `今日下班時間：${formatDate(target)} <span class="sparkle">💖</span>`;

    const diff = target - now;
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours === 0 && minutes < 10) {
      statusEl.textContent = "最後 10 分鐘，記得去尿尿！";
    } else if (hours === 0 && minutes < 30) {
      statusEl.textContent = "請準備收拾包包🎒";
    } else if (hours === 0) {
      statusEl.textContent = "剩不到一小時，可以包一包等下班了 ✨";
    } else {
      statusEl.textContent = getReminderByFiveMinute(now);
    }

    footerTextEl.textContent = "Countdown to 5:00 PM · 下班倒數中";
    return;
  }

  if (mode === "after_work_break") {
    targetTextEl.innerHTML = `下次上班時間：${formatDate(target)} <span class="sparkle">😴</span>`;
    statusEl.textContent = "現在是下班休息時間，晚安馬卡巴卡 😴";
    footerTextEl.textContent = "Off Work Time · 下班休息中";
    return;
  }

  if (mode === "before_work_break") {
    targetTextEl.innerHTML = `今日上班時間：${formatDate(target)} <span class="sparkle">😴</span>`;
    statusEl.textContent = "現在是上班前休息時間，請準時起床 🥱";
    footerTextEl.textContent = "Before Work · 上班前休息中";
  }
}

// =========================================================
// 運勢
// =========================================================
function drawFortune() {
  if (!canDrawFortune()) {
    updateFortuneButtonState();
    return;
  }

  const fortune = getRandomFortune();
  currentFortune = fortune;

  if (TEST_MODE) {
    localStorage.setItem("fortune_last_draw_time", String(Date.now()));
  } else {
    const currentHourKey = getCurrentDateHourKey();
    localStorage.setItem("fortune_last_draw_hour", currentHourKey);
  }

  localStorage.setItem("fortune_last_result_name", fortune.name);
  localStorage.setItem("fortune_last_result_image", fortune.image);

  const titleEl = resultModalEl.querySelector(".modal-title");
  if (titleEl) {
    titleEl.innerHTML = `
      今日運籤：${fortune.name} 🏮
      <div style="font-size:16px; margin-top:6px; font-weight:700;">
        ${fortune.desc}
      </div>
    `;
  }

  showSingleResultImage(fortune.image);
  resultModalEl.classList.remove("hidden");

  luckyDrawAreaEl.classList.add("hidden");
  luckyDrawStatusEl.textContent = "";
  luckyDrawBtn.disabled = false;
  luckyDrawBtn.textContent = "幸運抽獎";

  const luckyConfig = getLuckyDrawConfigByFortune(fortune.name);

  if (luckyConfig) {
    luckyDrawAreaEl.classList.remove("hidden");
    luckyDrawBtn.textContent = luckyConfig.buttonText;

    if (fortune.name === "吉") {
      fortuneHintEl.textContent = `你這次抽到的是：${fortune.name}，可抽 4~6 獎其中 1 個 🎁`;
    } else if (fortune.name === "大吉") {
      fortuneHintEl.textContent = `你這次抽到的是：${fortune.name}，可抽 1~3 獎其中 1 個 🎁`;
    } else if (fortune.name === "隱藏大獎") {
      fortuneHintEl.textContent = `你這次抽到的是：${fortune.name}，可進行 1~3 獎 3連抽 🎁🎁🎁`;
    }
  } else {
    fortuneHintEl.textContent = `你這次抽到的是：${fortune.name} ✨`;
  }

  updateFortuneButtonState();
}

// =========================================================
// 問答視窗
// =========================================================
function openQuestionModal() {
  currentQA = getRandomQA();
  modalQuestionTextEl.textContent = currentQA.question;
  modalAnswerInputEl.value = "";
  questionModalEl.classList.remove("hidden");

  setTimeout(() => {
    modalAnswerInputEl.focus();
  }, 50);
}

function closeQuestionModal() {
  questionModalEl.classList.add("hidden");
}

function openResultModal(imagePath, title = "答案揭曉 🐸") {
  const titleEl = resultModalEl.querySelector(".modal-title");
  if (titleEl) {
    titleEl.textContent = title;
  }

  showSingleResultImage(imagePath);
  resultModalEl.classList.remove("hidden");
}

function closeResultModal() {
  resultModalEl.classList.add("hidden");
  resultImageEl.src = "";
  clearPrizeGrid();
  luckyDrawAreaEl.classList.add("hidden");
  luckyDrawStatusEl.textContent = "";
  luckyDrawBtn.disabled = false;
  luckyDrawBtn.textContent = "幸運抽獎";
  currentFortune = null;
}

function submitQuestionAnswer() {
  if (!currentQA) return;

  closeQuestionModal();
  openResultModal(currentQA.image, "答案揭曉 🐸");
}

// =========================================================
// 幸運抽獎
// =========================================================
function playLuckyDrawEffect(callback) {
  const effectTexts = [
    "抽獎中 ✨",
    "抽獎中 ✨✨",
    "抽獎中 ✨✨✨",
    "獎項揭曉 🎁"
  ];

  let index = 0;

  luckyDrawBtn.disabled = true;
  luckyDrawStatusEl.textContent = effectTexts[0];

  const timer = setInterval(() => {
    index++;
    if (index < effectTexts.length) {
      luckyDrawStatusEl.textContent = effectTexts[index];
    } else {
      clearInterval(timer);
      callback();
    }
  }, 450);
}

function doLuckyDraw() {
  if (!currentFortune) return;

  const config = getLuckyDrawConfigByFortune(currentFortune.name);
  if (!config) return;

  playLuckyDrawEffect(() => {
    const titleEl = resultModalEl.querySelector(".modal-title");

    // -----------------------------------------------------
    // 單抽模式
    // 吉 -> 4~6
    // 大吉 -> 1~3
    // -----------------------------------------------------
    if (config.mode === "single") {
      const [minNo, maxNo] = config.prizeRange;
      const prize = getRandomPrizeFromRange(minNo, maxNo);

      localStorage.setItem("prize_last_result_name", prize.name);
      localStorage.setItem("prize_last_result_image", prize.image);

      if (titleEl) {
        titleEl.innerHTML = `
          今日運籤：${currentFortune.name} 🏮
          <div style="font-size:16px; margin-top:6px; font-weight:700;">
            ${currentFortune.desc}
          </div>
          <div style="font-size:18px; margin-top:14px; font-weight:900; color:#ff4f8b;">
            🎁 幸運抽獎：獎項 ${prize.name}
          </div>
          <div style="font-size:15px; margin-top:6px; font-weight:700;">
            ${prize.desc}
          </div>
        `;
      }

      showSingleResultImage(prize.image);
      luckyDrawStatusEl.textContent = `恭喜抽中獎項 ${prize.name} 🎉`;
      luckyDrawBtn.disabled = true;
      return;
    }

    // -----------------------------------------------------
    // 3連抽模式
    // 隱藏大獎 -> 1~3 抽 3 次
    // -----------------------------------------------------
    if (config.mode === "triple") {
      const [minNo, maxNo] = config.prizeRange;
      const prizes = [
        getRandomPrizeFromRange(minNo, maxNo),
        getRandomPrizeFromRange(minNo, maxNo),
        getRandomPrizeFromRange(minNo, maxNo)
      ];

      localStorage.setItem("prize_last_result_name", prizes.map(p => p.name).join(","));
      localStorage.setItem("prize_last_result_image", prizes.map(p => p.image).join(","));

      if (titleEl) {
        titleEl.innerHTML = `
          今日運籤：${currentFortune.name} 🏮
          <div style="font-size:16px; margin-top:6px; font-weight:700;">
            ${currentFortune.desc}
          </div>
          <div style="font-size:18px; margin-top:14px; font-weight:900; color:#ff4f8b;">
            🎁 隱藏大獎 3連抽結果
          </div>
          <div style="font-size:15px; margin-top:6px; font-weight:700;">
            共抽出 3 個獎項
          </div>
        `;
      }

      showTriplePrizeCards(prizes);

      luckyDrawStatusEl.textContent =
        `恭喜抽中：${prizes.map((p, i) => `第${i + 1}抽-獎項${p.name}`).join("、")} 🎉`;

      luckyDrawBtn.disabled = true;
    }
  });
}

// =========================================================
// 事件綁定
// =========================================================
fortuneBtn.addEventListener("click", () => {
  drawFortune();
});

luckyDrawBtn.addEventListener("click", () => {
  doLuckyDraw();
});

mainPhotoEl.addEventListener("click", () => {
  openQuestionModal();
});

modalCancelBtn.addEventListener("click", () => {
  closeQuestionModal();
});

modalSubmitBtn.addEventListener("click", () => {
  submitQuestionAnswer();
});

modalAnswerInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitQuestionAnswer();
  }
});

resultCloseBtn.addEventListener("click", () => {
  closeResultModal();
});

questionModalEl.addEventListener("click", (event) => {
  if (event.target === questionModalEl) {
    closeQuestionModal();
  }
});

resultModalEl.addEventListener("click", (event) => {
  if (event.target === resultModalEl) {
    closeResultModal();
  }
});

// =========================================================
// 初始化
// =========================================================
ensurePrizeGrid();
updateCountdown();
updateFortuneButtonState();

setInterval(() => {
  updateCountdown();
  updateFortuneButtonState();
}, 1000);