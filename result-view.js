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
