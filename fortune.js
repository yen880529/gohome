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
