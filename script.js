"use strict";

(function () {
  // ===================== CONFIG =====================
  const PASS_THRESHOLD = 70;
  const usePercentThreshold = true; // set false to treat threshold as raw points
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
    // Cache elements after DOM is ready
    const welcomeScreen = $("#welcome-screen");
    const gameScreen    = $("#game-screen");
    const resultScreen  = $("#result-screen");

    const startBtn      = $("#start-btn");
    const restartBtn    = $("#restart-btn");
    const downloadCert  = $("#download-cert");

    const timeLeftEl    = $("#time-left");
    const scoreEl       = $("#score");
    const progressEl    = $("#progress");

    const questionText  = $("#question-text");
    const optionsWrap   = $("#options");
    const submitBtn     = $("#submit-btn");
    const hintBtn       = $("#hint-btn");
    const feedbackEl    = $("#feedback");

    const finalScoreEl  = $("#final-score");
    const resultTitle   = $("#result-title");
    const passBlock     = $("#pass-block");
    const failBlock     = $("#fail-block");

    // Guard: if critical elements are missing, bail with a console message
    if (!startBtn || !welcomeScreen || !gameScreen || !resultScreen || !submitBtn || !questionText || !optionsWrap) {
      console.error("Initialization failed: missing required DOM elements.");
      return;
    }

    function updateHUD() {
      if (scoreEl)   scoreEl.textContent   = String(score);
      if (progressEl) progressEl.textContent = `${Math.min(currentIndex + 1, questions.length)} / ${questions.length}`;
      if (timeLeftEl) timeLeftEl.textContent = SECONDS_PER_QUESTION > 0 ? String(timeRemaining) : "—";
    }

    function resetGameState() {
      score = 0;
      currentIndex = 0;
      timeRemaining = SECONDS_PER_QUESTION;
      hasAnsweredThisQuestion = false;
      clearInterval(timerId);
      if (feedbackEl) feedbackEl.textContent = "";
      if (optionsWrap) optionsWrap.innerHTML = "";
      if (submitBtn) {
        submitBtn.textContent = "Submit Answer";
        disable(submitBtn);
      }
      updateHUD();
    }

    function startTimer() {
      clearInterval(timerId);
      if (SECONDS_PER_QUESTION <= 0) return;
      timerId = setInterval(() => {
        timeRemaining--;
        if (timeLeftEl) timeLeftEl.textContent = String(timeRemaining);
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
      if (feedbackEl) feedbackEl.textContent = "";
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
          if (feedbackEl) feedbackEl.textContent = "Correct!";
        } else {
          selected.classList.add("incorrect");
          if (feedbackEl) feedbackEl.textContent = "Not quite.";
        }
      } else {
        if (feedbackEl) feedbackEl.textContent = "Time’s up! Moving on.";
      }

      updateHUD();
      if (submitBtn) submitBtn.textContent = (currentIndex < questions.length - 1) ? "Next Question" : "Finish";
    }

    function nextStepOrFinish() {
      if (!submitBtn) return;
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
      hide(gameScreen);
      show(resultScreen);
      clearInterval(timerId);

      if (finalScoreEl) finalScoreEl.textContent = String(score);

      const passed = meetsThreshold(score);
      if (resultTitle) resultTitle.textContent = passed ? "Congratulations!" : "Good effort!";
      if (passed) {
        hide(failBlock);
        show(passBlock);
      } else {
        hide(passBlock);
        show(failBlock);
      }
    }

    // ========= Events =========
    startBtn.addEventListener("click", () => {
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
      if (feedbackEl) feedbackEl.textContent = "Hint: " + q.hint;
    });

    // Safe PDF generation: only run when button is clicked AND jsPDF is present
    downloadCert?.addEventListener("click", () => {
      const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
      if (!hasJsPDF) {
        alert("PDF generator not loaded. Please check your internet connection and try again.");
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A4" });

      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const centerX = W / 2;

      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(4);
      doc.rect(24, 24, W - 48, H - 48);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.text("Certificate of Completion", centerX, 140, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.text("ATO Training Game", centerX, 180, { align: "center" });

      doc.setLineWidth(1);
      doc.line(160, 200, W - 160, 200);

      const pct = Math.round((score / totalPoints()) * 100);
      const passed = meetsThreshold(score);
      const statusText = passed ? "PASSED" : "FAILED";
      const statusColor = passed ? [16, 185, 129] : [239, 68, 68];

      doc.setFontSize(14);
      doc.text(`Awarded to: ______________________________`, centerX, 260, { align: "center" });
      doc.text(`Final Score: ${score} / ${totalPoints()} (${pct}%)`, centerX, 295, { align: "center" });

      doc.setTextColor(...statusColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Status: ${statusText}`, centerX, 330, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      doc.line(W * 0.25, 420, W * 0.45, 420);
      doc.text("Authorized Signature", W * 0.35, 440, { align: "center" });

      doc.line(W * 0.55, 420, W * 0.75, 420);
      const today = new Date().toLocaleDateString();
      doc.text(`Date (${today})`, W * 0.65, 440, { align: "center" });

      doc.setFontSize(10);
      doc.text("Generated by ATO Training Game", centerX, H - 40, { align: "center" });

      doc.save("ATO-Certificate.pdf");
    });

    // Keyboard QoL
    document.addEventListener("keydown", (e) => {
      if (gameScreen.classList.contains("hidden")) return;
      if (e.key === "Enter" && !submitBtn?.disabled) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    // Show welcome by default
    show(welcomeScreen);
    hide(gameScreen);
    hide(resultScreen);
  }

  // Wait until DOM is fully parsed
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
