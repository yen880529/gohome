function bindEvents() {
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
}
