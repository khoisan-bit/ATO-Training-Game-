// Quiz Questions and Hints
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    answers: [
      { text: "Legitimate customer login.", correct: false },
      { text: "Malicious actor gains access.", correct: true },
      { text: "Simulating accounts for testing.", correct: false }
    ],
    hint: "Hint: ATO involves unauthorized access to a valid account."
  },
  {
    question: "Which is a red flag for phishing?",
    answers: [
      { text: "Generic greetings like 'Dear Customer'.", correct: true },
      { text: "Proper domain spelling.", correct: false },
      { text: "Well-constructed subject.", correct: false }
    ],
    hint: "Hint: Phishing emails often use generic introductions."
  },
  {
    question: "What does ATO_INV_LATO stand for?",
    answers: [
      { text: "ATO Lock Investigations.", correct: true },
      { text: "A mislabeled lock queue.", correct: false },
      { text: "Authentication lock reset system.", correct: false }
    ],
    hint: "Hint: Refers to lock trails and investigations."
  },
  {
    question: "Where is the ATO Lock queue located?",
    answers: [
      { text: "CF1.", correct: false },
      { text: "Notary.", correct: true },
      { text: "Engineering Lock Queue.", correct: false }
    ],
    hint: "Hint: Think about common internal tools."
  },
  {
    question: "A flagged IP connects multiple accounts. What action to take?",
    answers: [
      { text: "Rollback activity linked to the flagged IP.", correct: true },
      { text: "Ignore and wait unless improper access arises.", correct: false },
      { text: "Inform 3rd-tier engineering directly.", correct: false }
    ],
    hint: "Hint: Rolling back activities secures the account immediately."
  },
  // Add remaining 9 questions...
];

// Game Variables
let score = 0;
let currentQuestionIndex = 0;
let timer;
const totalTime = 15; // Total time per question (seconds)

// DOM Elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const hintButton = document.getElementById("hint-btn");
const certificateBtn = document.getElementById("certificate-btn");
const timerElement = document.getElementById("timer");
const finalScoreElement = document.getElementById("final-score");

// Start Game
document
  .getElementById("start-game")
  .addEventListener("click", () => startGame());

function startGame() {
  welcomeScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  score = 0;
  currentQuestionIndex = 0;
  loadQuestion();
}

// Load Question
function loadQuestion() {
  const currentQuestion = levels[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answersContainer.innerHTML = ""; // Reset answers
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.onclick = () => handleAnswer(answer.correct);
    answersContainer.appendChild(button);
  });

  // Hint Setup
  if (currentQuestion.hint) {
    hintButton.classList.remove("hidden");
    hintButton.onclick = () => showHint(currentQuestion.hint);
  } else {
    hintButton.classList.add("hidden");
  }

  startTimer();
  updateProgressBar();
}

// Handle Answer
function handleAnswer(isCorrect) {
  clearInterval(timer); // Stop timer
  if (isCorrect) {
    score += 10; // Add score
    triggerConfetti(); // Show confetti!
  } else {
    score -= 3; // Deduct score
  }

  currentQuestionIndex += 1;
  if (currentQuestionIndex < levels.length) {
    setTimeout(loadQuestion, 1000); // Load next question
  } else {
    endGame();
  }
}

// Timer Logic
function startTimer() {
  let timeLeft = totalTime;
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft -= 1;
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(false); // Automatically mark unanswered as incorrect
    }
  }, 1000);
}

// Progress Bar Update
function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Show Hint
function showHint(hint) {
  hintText.textContent = hint;
}

// End Game
function endGame() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreElement.textContent = `${score}`;

  if (score >= 70) {
    certificateBtn.classList.remove("hidden");
  } else {
    certificateBtn.classList.add("hidden");
  }
}

// Confetti Functionality
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.7 },
  });
}

// Certificate Download
certificateBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Certificate of Completion", 20, 30);
  doc.text(`Congratulations!`, 20, 50);
  doc.text(`You scored ${score} points out of ${levels.length * 10}.`, 20, 70);
  doc.save("Certificate.pdf");
});

// Restart Game
document
  .getElementById("restart-btn")
  .addEventListener("click", () => location.reload());
