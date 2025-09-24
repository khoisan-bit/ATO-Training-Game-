"use strict";

/* ==============================
   CONFIG
   ============================== */

// Pass threshold (points or % if you flip usePercentThreshold)
const PASS_THRESHOLD = 70;
const usePercentThreshold = true; // true => 70 means 70%

// Per-question timer (seconds). Set to 0 to disable timer.
const SECONDS_PER_QUESTION = 15;

// Placeholder questions (20 pts each = 100 total)
// Replace with your real questions. Add as many as you like.
const questions = [
  {
    text: "A customer reports charges they don't recognize and their email was changed yesterday. First step?",
    options: [
      "Verify the customer identity and secure the account",
      "Refund immediately without verifying",
      "Tell them to call the bank only",
      "Close the account permanently without review"
    ],
    correctIndex: 0,
    points: 20,
    hint: "ATO handling starts with identity verification + securing access."
  },
  {
    text: "Which is a common ATO signal?",
    options: [
      "Consistent logins from the same device",
      "Password change followed by new device login",
      "No changes for 6 months",
      "Using a passphrase manager"
    ],
    correctIndex: 1,
    points: 20,
    hint: "Look for changes + new devices close together."
  },
  {
    text: "What’s best practice after suspected takeover?",
    options: [
      "Disable 2FA",
      "Force password reset and re-enable 2FA",
      "Share the previous password",
      "Ignore if balance is low"
    ],
    correctIndex: 1,
    points: 20,
    hint: "Strengthen, don’t weaken, authentication."
  },
  {
    text: "Customer cannot access recovery email/phone. You should:",
    options: [
      "Bypass checks if the name matches",
      "Use alternate verified identity checks",
      "Deny help automatically",
      "Ask for their old password"
    ],
    correctIndex: 1,
    points: 20,
    hint: "Use approved alternate verification flows."
  },
  {
    text: "Post-ATO remediation often includes:",
    options: [
      "Advising stronger unique passwords and 2FA",
      "Turning off notifications",
      "Sharing device cookies with the customer",
      "No documentation"
    ],
    correctIndex: 0,
    points: 20,
    hint: "Educate + secure + document."
  }
];

/* ==============================
   ELEMENTS
   ============================== */
const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen    = document.getElementById("game-screen");
const resultScreen  = document.getElementById("result-screen");

const startBtn      = document.getElementById("start-btn");
const restartBtn    = document.getElementById("restart-btn");
const downloadCert  = document.getElementById("download-cert");

const timeLeftEl    = document.getElementById("time-left");
const scoreEl       = document.getElementById("score");
const progressEl    = document.getElementById("progress");

const questionText  = document.getElementById("question-text");
const optionsWrap   = document.getElementById("options");
const submitBtn     = document.getElementById("submit-btn");
const hintBtn       = document.getElementById("hint-btn");
const feedbackEl    = document.getElementById("feedback");

const finalScoreEl  = document.getElementById("final-score");
const resultTitle   = document.getElementById("result-title");
const passBlock     = document.getElementById("pass-block");
const failBlock     = document.getElementById("fail-block");

/* ==============================
   STATE
   ============================== */
let score = 0;
let currentIndex = 0;
let timerId = null;
let timeRemaining = SECONDS_PER_QUESTION;
let hasAnsweredThisQuestion = false;

/* ==============================
   HELPERS
   ============================== */
function $(sel, root = document) { return root.querySelector(sel); }
function show(el)   { el.classList.remove("hidden"); }
function hide(el)   { el.classList.add("hidden"); }
function disable(el){ el.setAttribute("disabled", "true"); }
function enable(el) { el.removeAttribute("disabled"); }

function totalPoints() {
  return questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
}

function meetsThreshold(finalScore) {
  if (usePercentThreshold) {
    const pct = (finalScore / totalPoints()) * 100;
    return pct >= PASS_THRESHOLD;
  }
  return finalScore >= PASS_THRESHOLD;
}

function updateHUD() {
  scoreEl.textContent = String(score);
  progressEl.textContent = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;
  if (SECONDS_PER_QUESTION > 0) timeLeftEl.textContent = String(timeRemaining);
  else timeLeftEl.textContent = "—";
}

function resetGameState() {
  score = 0;
  currentIndex = 0;
  timeRemaining = SECONDS_PER_QUESTION;
  hasAnsweredThisQuestion = false;
  clearInterval(timerId);
  updateHUD();
  feedbackEl.textContent = "";
  optionsWrap.innerHTML = "";
  submitBtn.textContent = "Submit Answer";
  disable(submitBtn);
}

function startTimer() {
  clearInterval(timerId);
  if (SECONDS_PER_QUESTION <= 0) return;
  timerId = setInterval(() => {
    timeRemaining--;
    timeLeftEl.textContent = String(timeRemaining);
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      lockInAnswer(); // auto-submit on time out
    }
  }, 1000);
}

function renderQuestion() {
  const q = questions[currentIndex];
  questionText.textContent = q.text;
  optionsWrap.innerHTML = "";
  feedbackEl.textContent = "";
  hasAnsweredThisQuestion = false;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", "false");
    btn.dataset.index = String(idx);
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      // ensure only one selected
      [...optionsWrap.children].forEach(b => {
        b.classList.remove("selected");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-selected", "true");
      enable(submitBtn);
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
    optionsWrap.appendChild(btn);
  });

  // reset timer + HUD
  timeRemaining = SECONDS_PER_QUESTION;
  startTimer();
  updateHUD();
}

function lockInAnswer() {
  if (hasAnsweredThisQuestion) return;
  hasAnsweredThisQuestion = true;
  clearInterval(timerId);

  const selected = optionsWrap.querySelector(".option.selected");
  const q = questions[currentIndex];
  const correct = Number(q.correctIndex);

  // paint correct/incorrect
  [...optionsWrap.children].forEach((b, i) => {
    if (i === correct) b.classList.add("correct");
  });
  if (selected) {
    const chosen = Number(selected.dataset.index);
    if (chosen === correct) {
      score += (q.points ?? 0);
      feedbackEl.textContent = "Correct!";
    } else {
      selected.classList.add("incorrect");
      feedbackEl.textContent = "Not quite.";
    }
  } else {
    feedbackEl.textContent = "Time’s up! Moving on.";
  }
  updateHUD();

  // change button to Next
  submitBtn.textContent = (currentIndex < questions.length - 1) ? "Next Question" : "Finish";
}

function nextStepOrFinish() {
  if (submitBtn.textContent === "Submit Answer") {
    lockInAnswer();
    return;
  }
  // Next / Finish behavior
  currentIndex++;
  if (currentIndex >= questions.length || meetsThreshold(score)) {
    finishGame();
  } else {
    renderQuestion();
    submitBtn.textContent = "Submit Answer";
    disable(submitBtn);
  }
}

function finishGame() {
  hide(gameScreen);
  show(resultScreen);
  clearInterval(timerId);

  finalScoreEl.textContent = String(score);

  const passed = meetsThreshold(score);
  if (passed) {
    resultTitle.textContent = "Congratulations!";
    hide(failBlock);
    show(passBlock);
  } else {
    resultTitle.textContent = "Good effort!";
    hide(passBlock);
    show(failBlock);
  }
}

/* ==============================
   EVENTS
   ============================== */
startBtn?.addEventListener("click", () => {
  hide(welcomeScreen);
  hide(resultScreen);
  show(gameScreen);
  resetGameState();
  renderQuestion();
});

restartBtn?.addEventListener("click", () => {
  hide(resultScreen);
  show(welcomeScreen);
});

submitBtn?.addEventListener("click", nextStepOrFinish);

hintBtn?.addEventListener("click", () => {
  const q = questions[currentIndex];
  if (!q?.hint) return;
  feedbackEl.textContent = "Hint: " + q.hint;
});

downloadCert?.addEventListener("click", () => {
  // Placeholder action: you can replace with real PDF generation.
  // For now, just create a simple text blob as a “certificate”.
  const name = "ATO Certificate";
  const content = `Certificate of Completion\n\nScore: ${score}\nStatus: PASSED\n`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.txt`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
});

/* ==============================
   QUALITY-OF-LIFE: keyboard
   ============================== */
document.addEventListener("keydown", (e) => {
  if (gameScreen.classList.contains("hidden")) return;
  // Press Enter to submit/next when a choice is selected
  if (e.key === "Enter") {
    if (!submitBtn.disabled) {
      e.preventDefault();
      submitBtn.click();
    }
  }
});
