// Questions Array (14 Questions)
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    answers: [
      { text: "Legitimate customer login", correct: false },
      { text: "Malicious actor gains access", correct: true },
      { text: "Testing multiple logins", correct: false }
    ],
    hint: "Hint: Think of unauthorized access to an account."
  },
  {
    question: "Which is a red flag for phishing?",
    answers: [
      { text: "Generic salutations like 'Dear Customer'", correct: true },
      { text: "Proper domain names", correct: false },
      { text: "Legit-looking links", correct: false }
    ],
    hint: "Hint: Phishing emails use generic intros to gain trust."
  },
  // Add 12 more questions...
];

// DOM Elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionElement = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const finalScoreElement = document.getElementById("final-score");
const hintText = document.getElementById("hint-text");
const hintButton = document.getElementById("hint-btn");

let score = 0;
let currentLevel = 0;
let timer;
const maxScore = 140; // 14 questions * 10 points
const timePerQuestion = 15;

// Start Game
document.getElementById("start-btn").addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentLevel = 0;
  score = 0;
  displayNextQuestion();
});

// Display Next Question
function displayNextQuestion() {
  if (currentLevel >= levels.length) {
    endGame();
    return;
  }

  const currentQuestion = levels[currentLevel];
  questionElement.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.onclick = () => handleAnswer(answer.correct);
    answersContainer.appendChild(button);
  });

  hintText.textContent = ""; // Clear hint text
  if (currentQuestion.hint) {
    hintButton.classList.remove("hidden");
    hintButton.onclick = () => (hintText.textContent = currentQuestion.hint);
  } else {
    hintButton.classList.add("hidden");
  }

  updateProgressBar();
  startTimer();
}

// Handle Answer
function handleAnswer(isCorrect) {
  if (isCorrect) {
    score += 10;
    triggerConfetti();
  } else {
    score -= 3;
  }
  clearInterval(timer); // Clear timer
  currentLevel++;
  setTimeout(displayNextQuestion, 1000);
}

// Start Timer
function startTimer() {
  let timeLeft = timePerQuestion;
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      currentLevel++;
      displayNextQuestion();
    }
  }, 1000);
}

// Trigger Confetti
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Update Progress Bar
function updateProgressBar() {
  const progress = (currentLevel / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// End Game
function endGame() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreElement.textContent = `${score}`;
  if (score >= 70) {
    document.getElementById("certificate-btn").classList.remove("hidden");
  } else {
    document.getElementById("certificate-btn").classList.add("hidden");
  }
}

// Generate Certificate
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Certificate of Completion", 20, 30);
  doc.text(`Final Score: ${score}/140`, 20, 50);
  doc.text("Well Done!", 20, 70);
  doc.save("ATO_Certificate.pdf");
}
