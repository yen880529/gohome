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
  mainPhotoEl.src = now >= switchTime ? PHOTO2 : PHOTO1;
}

function getReminderByFiveMinute(now) {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const index = Math.floor(totalMinutes / 5) % rotatingReminders.length;
  return rotatingReminders[index];
}

function setThemeColors(colors) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

function applyThemeByTime(now) {
  const hour = now.getHours();

  if (hour >= 5 && hour < 8) {
    setThemeColors({
      "--bg1": "#fff1b8",
      "--bg2": "#ffd9c9",
      "--bg3": "#ffe9f3",
      "--text-main": "#704c41",
      "--title-color": "#c06a6a",
      "--subtitle-color": "#8a625c",
      "--number-color": "#d86f7c",
      "--status-color": "#a35f6e",
      "--footer-color": "#9d7c76"
    });
  } else if (hour >= 8 && hour < 12) {
    setThemeColors({
      "--bg1": "#fff3b0",
      "--bg2": "#ffd6e7",
      "--bg3": "#d9e7ff",
      "--text-main": "#6b325e",
      "--title-color": "#b14d8a",
      "--subtitle-color": "#7a4a71",
      "--number-color": "#c94f93",
      "--status-color": "#9c4f80",
      "--footer-color": "#9b7693"
    });
  } else if (hour >= 12 && hour < 16) {
    setThemeColors({
      "--bg1": "#ffe7a8",
      "--bg2": "#ffcfcf",
      "--bg3": "#ffdff5",
      "--text-main": "#6a3b4f",
      "--title-color": "#c25a76",
      "--subtitle-color": "#84586b",
      "--number-color": "#d05b74",
      "--status-color": "#a35370",
      "--footer-color": "#9b7086"
    });
  } else if (hour >= 16 && hour < 18) {
    setThemeColors({
      "--bg1": "#ffd3a5",
      "--bg2": "#ffb7c5",
      "--bg3": "#d8c3ff",
      "--text-main": "#5e3559",
      "--title-color": "#b14d8a",
      "--subtitle-color": "#7c4f73",
      "--number-color": "#d14d87",
      "--status-color": "#9d4a7f",
      "--footer-color": "#936f92"
    });
  } else if (hour >= 18 && hour < 22) {
    setThemeColors({
      "--bg1": "#7a5fa3",
      "--bg2": "#5f5d9b",
      "--bg3": "#2e3f70",
      "--text-main": "#f8ecff",
      "--title-color": "#ffd6f2",
      "--subtitle-color": "#eedcff",
      "--number-color": "#ffb8e0",
      "--status-color": "#ffd7ef",
      "--footer-color": "#dfc7f2"
    });
  } else {
    setThemeColors({
      "--bg1": "#24324f",
      "--bg2": "#2f2b5a",
      "--bg3": "#121a33",
      "--text-main": "#edf3ff",
      "--title-color": "#cfe0ff",
      "--subtitle-color": "#d6ddff",
      "--number-color": "#ffcae7",
      "--status-color": "#e8e3ff",
      "--footer-color": "#bcc7ea"
    });
  }
}

function updateCountdownNumbers(target, now) {
  const diff = target - now;
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function resetCountdownNumbers() {
  hoursEl.textContent = "00";
  minutesEl.textContent = "00";
  secondsEl.textContent = "00";
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

  if (target) {
    updateCountdownNumbers(target, now);
  } else {
    resetCountdownNumbers();
  }

  if (mode === "countdown_lunch") {
    targetTextEl.innerHTML = `午餐時間：${formatDate(target)} <span class="sparkle">🍱</span>`;
    statusEl.textContent = currentHours === 11 && currentMinutes >= 30
      ? "🍱 快中午了～準備吃小瓜餐🐌！"
      : "happy happy happy";
    footerTextEl.textContent = "Countdown to Lunch · 午餐倒數中";
    return;
  }

  if (mode === "lunch_break") {
    targetTextEl.innerHTML = `現在是午休時間 <span class="sparkle">🍱</span>`;
    statusEl.textContent = "回家扁豆塔";
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
