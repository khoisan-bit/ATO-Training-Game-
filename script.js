"use strict";

(function () {
  // ===================== CONFIG =====================
  const PASS_THRESHOLD = 70;           // Pass mark
  const usePercentThreshold = true;    // true = use % instead of raw points
  const SECONDS_PER_QUESTION = 15;     // Set 0 to disable timer

  // ===================== QUESTIONS =====================
  const questions = [
    {
      text: "What is an account takeover (ATO)?",
      options: [
        "Legitimate customer login.",
        "Malicious actor gains access.",
        "Simulating accounts for testing."
      ],
      correctIndex: 1,
      points: 10,
      hint: "ATO involves unauthorized access to a legitimate account."
    },
    {
      text: "Which behavior is a red flag for phishing?",
      options: [
        "Generic salutations like 'Dear Customer.'",
        "Properly formatted domain names.",
        "Well-drafted email subject."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Phishing emails are often generic and try to appear trustworthy."
    },
    {
      text: "What does the ATO_INV_LATO system represent?",
      options: [
        "ATO Lock Investigations.",
        "A mislabeled lock queue.",
        "Authentication lock reset."
      ],
      correctIndex: 0,
      points: 10,
      hint: "This refers to locking events related to ATO investigations."
    },
    {
      text: "What is the most critical action upon detecting suspicious activity?",
      options: [
        "Rollback access to secure account status.",
        "Close the account immediately.",
        "Notify external parties."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Rollbacks are effective for restoring account security."
    },
    {
      text: "A flagged IP connected multiple accounts. What should you do?",
      options: [
        "Rollback activity linked to the flagged IP.",
        "Ignore it if no improper access occurred.",
        "Inform engineering immediately."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Flagged IP-based infiltration tactics often need rollback action."
    },
    {
      text: "Where is the ATO Lock queue located in your system?",
      options: [
        "CF1",
        "Notary",
        "Engineering repository"
      ],
      correctIndex: 1,
      points: 10,
      hint: "The queue is a part of the Notary system as described in training."
    },
    {
      text: "Scenario: Fraud models identify login change patterns. React?",
      options: [
        "Rollback flagged account activity quickly.",
        "Leave suspected behavior uninvestigated.",
        "Allow dynamic re-attempts."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Suspicious login sequences must be addressed with rollback action."
    },
    {
      text: "Bulk queued events indicate inauthentic grouping. First decision?",
      options: [
        "Data-review flagged outputs for patterns.",
        "Ignore single smaller bulk triggers for ease.",
        "Wait before investigating grouped accounts."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Bulk flagged queues hold meaningful patterns for review."
    },
    {
      text: "A flagged payment far exceeds normal transaction amounts. What to do?",
      options: [
        "Validate the flagged payment for fraud.",
        "Reverse the payment immediately.",
        "Escalate the transaction without validation."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Fraudulent payment spikes must be assessed first."
    },
    {
      text: "Which behavior matches phishing-related activity?",
      options: [
        "Identical URLs to authorized domains.",
        "Regularly used email addresses.",
        "Localized financial links."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Phishing URLs often try to mimic trusted domains."
    },
    {
      text: "Login attempts flagged from phishing IPs. What’s next?",
      options: [
        "Rollback activity tied to flagged IPs.",
        "Ignore unless unauthorized access occurs.",
        "Escalate without any rollback."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Rollbacks mitigate impact from phishing IP activity."
    },
    {
      text: "How do you handle flagged transaction logs?",
      options: [
        "Rollback flagged payment behaviors.",
        "Skip unless repeated evidence is flagged.",
        "Ignore flagged logs altogether."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Rollback all flagged sections for cleanup and review."
    },
    {
      text: "A suspicious sender profile flagged repeated phishing. What do you do?",
      options: [
        "Investigate senders and notify fraud teams.",
        "Ignore sender account patterns flagged this week.",
        "Assume phishing but ignore due to low risk."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Fraud team escalation clears systemic phishing issues."
    },
    {
      text: "Unusual signup patterns flagged in bulk. How do you respond?",
      options: [
        "Analyze flagged bulk before investigation escalation.",
        "Ignore flagged high-traffic bulk submissions.",
        "Wait for external verification before filing logs."
      ],
      correctIndex: 0,
      points: 10,
      hint: "Analyze and escalate grouped registration anomalies."
    }
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

    const start       = $("#start-btn");
    const playAgain   = $("#play-again-btn");
    const restart     = $("#restart-btn");

    const timeLeftEl  = $("#time-left");
    const scoreEl     = $("#score");
    const progressEl  = $("#progress");

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

    playAgain.addEventListener("click", () => {
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
