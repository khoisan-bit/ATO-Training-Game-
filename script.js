"use strict";

(function () {
  // ===================== CONFIG =====================
  const PASS_THRESHOLD = 70;
  const usePercentThreshold = true; 
  const SECONDS_PER_QUESTION = 15;

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
    // ...add the rest of your questions
  ];

  // ===================== STATE =====================
  let score = 0;
  let currentIndex = 0;
  let timerId = null;
  let timeRemaining = SECONDS_PER_QUESTION;
  let hasAnsweredThisQuestion = false;

  // ===================== HELPERS =====================
  const $ = (sel, root = document) => root.querySelector(sel);
  const show = (el) => el && el.classList.remove("hidden");
  const hide = (el) => el && el.classList.add("hidden");
  const disable = (el) => el && el.setAttribute("disabled", "true");
  const enable = (el) => el && el.removeAttribute("disabled");

  const totalPoints = () => questions.reduce((s, q) => s + (q.points ?? 0), 0);

  function meetsThreshold(finalScore) {
    if (usePercentThreshold) {
      const pct = (finalScore / totalPoints()) * 100;
      return pct >= PASS_THRESHOLD;
    }
    return finalScore >= PASS_THRESHOLD;
  }

  // ===================== MAIN =====================
  function init() {
    const welcome = $("#welcome-screen");
    const game    = $("#game-screen");
    const result  = $("#result-screen");

    const start   = $("#start-btn");
    const restart = $("#restart-btn");

    const timeLeftEl = $("#time-left");
    const scoreEl    = $("#score");
    const progressEl = $("#progress");

    const questionText = $("#question-text");
    const optionsWrap  = $("#options");
    const submitBtn    = $("#submit-btn");
    const hintBtn      = $("#hint-btn");
    const feedbackEl   = $("#feedback");

    const finalScoreEl = $("#final-score");
    const resultTitle  = $("#result-title");
    const passBlock    = $("#pass-block");
    const failBlock    = $("#fail-block");

    function updateHUD() {
      scoreEl.textContent = String(score);
      progressEl.textContent = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;
      timeLeftEl.textContent = SECONDS_PER_QUESTION > 0 ? String(timeRemaining) : "—";
    }

    function resetGame() {
      score = 0;
      currentIndex = 0;
      timeRemaining = SECONDS_PER_QUESTION;
      hasAnsweredThisQuestion = false;
      clearInterval(timerId);
      feedbackEl.textContent = "";
      optionsWrap.innerHTML = "";
      submitBtn.textContent = "Submit Answer";
      disable(submitBtn);
      updateHUD();
    }

    function startTimer() {
      clearInterval(timerId);
      if (SECONDS_PER_QUESTION <= 0) return;
      timerId = setInterval(() => {
        timeRemaining--;
        timeLeftEl.textContent = String(timeRemaining);
        if (timeRemaining <= 0) {
          clearInterval(timerId);
          lockInAnswer();
        }
      }, 1000);
    }

    function renderQuestion() {
      const q = questions[currentIndex];
      if (!q) return finishGame();

      questionText.textContent = q.text;
      optionsWrap.innerHTML = "";
      feedbackEl.textContent = "";
      hasAnsweredThisQuestion = false;

      q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option";
        btn.dataset.index = String(idx);
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          [...optionsWrap.children].forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          enable(submitBtn);
        });
        optionsWrap.appendChild(btn);
      });

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
      submitBtn.textContent = (currentIndex < questions.length - 1) ? "Next Question" : "Finish";
    }

    function nextStep() {
      if (submitBtn.textContent === "Submit Answer") {
        lockInAnswer();
        return;
      }
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
      hide(game);
      show(result);
      clearInterval(timerId);

      finalScoreEl.textContent = String(score);
      const passed = meetsThreshold(score);

      resultTitle.textContent = passed ? "Congratulations!" : "Good effort!";
      if (passed) {
        hide(failBlock);
        show(passBlock);
      } else {
        hide(passBlock);
        show(failBlock);
      }
    }

    // ========= Events =========
    start.addEventListener("click", () => {
      hide(welcome);
      hide(result);
      show(game);
      resetGame();
      renderQuestion();
    });

    restart.addEventListener("click", () => {
      hide(result);
      show(welcome);
    });

    submitBtn.addEventListener("click", nextStep);
    hintBtn.addEventListener("click", () => {
      const q = questions[currentIndex];
      if (q?.hint) feedbackEl.textContent = "Hint: " + q.hint;
    });

    // Show welcome by default
    show(welcome);
    hide(game);
    hide(result);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
