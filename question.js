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

function submitQuestionAnswer() {
  if (!currentQA) return;

  closeQuestionModal();
  openResultModal(currentQA.image, "答案揭曉 🐸");
}
