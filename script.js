const PHOTO1 = "photo1.jpg";
const PHOTO2 = "photo2.jpg";

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

const rotatingReminders = [
  "記得喝水 💧",
  "坐久屁股酸記得動動 ✨",
  "眼睛要休息 👀",
  "手腳動動 🙆",
  "深呼吸 🌿",
  "晚餐要吃啥 🐰",
];

let currentQA = null;

function getTodayAt(hour, minute = 0, second = 0, ms = 0) {
  const target = new Date();
  target.setHours(hour, minute, second, ms);
  return target;
}

function getNextWorkStart() {
  const now = new Date();
  const target = new Date();

  target.setHours(8, 0, 0, 0);

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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

function getRandomQA() {
  const index = Math.floor(Math.random() * QA_LIST.length);
  return QA_LIST[index];
}

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

function openResultModal(imagePath) {
  resultImageEl.src = imagePath;
  resultModalEl.classList.remove("hidden");
}

function closeResultModal() {
  resultModalEl.classList.add("hidden");
  resultImageEl.src = "";
}

function submitQuestionAnswer() {
  if (!currentQA) return;

  closeQuestionModal();
  openResultModal(currentQA.image);
}

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

updateCountdown();
setInterval(updateCountdown, 1000);