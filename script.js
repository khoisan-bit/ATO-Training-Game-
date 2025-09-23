// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
let timer; // Timer for the question
const minScoreForCertificate = 70; // Minimum score to unlock the certificate
let playerName; // Store player's name

// DOM Elements
const scoreTracker = document.getElementById("score-tracker");
const progressBar = document.getElementById("progress-bar");
const feedbackElement = document.getElementById("feedback");
const optionsContainer = document.querySelector(".options");
const questionElement = document.getElementById("question");
const timerElement = document.getElementById("timer");
const nextButton = document.getElementById("next-question");
const hintButton = document.getElementById("hint-btn");
const certificateSection = document.getElementById("certificate-section");

// Define All 14 Questions
const levels = [
  { question: "What is an account takeover (ATO)?", options: [ ... ], hint: "Hint: ATO involves unauthorized access." },
  { question: "Which is a red flag of phishing?", options: [ ... ], hint: "Hint: Emails with 'Dear Customer'..." },
  { question: "What is a Bulk Lock?", options: [ ... ], hint: "Hint: Risk Model flagged locks..." },
  { question: "..." }, // Include remaining 10 questions here, following the same structure!
];

// Start Game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  playerName = document.getElementById("player-name").value;
  if (!playerName) {
    alert("Please enter your name to start the game.");
    return;
  }
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show Level
function showLevel() {
  clearInterval(timer); // Clear the previous timer
  questionElement.textContent = levels[currentLevel].question;
  optionsContainer.innerHTML = ""; // Reset options
  levels[currentLevel].options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = () => handleAnswer(option.isCorrect);
    button.classList.add("option");
    optionsContainer.appendChild(button);
  });
  feedbackElement.textContent = ""; // Reset feedback
  nextButton.classList.add("hidden");
  hintButton.classList.remove("hidden"); // Show hint button
  hintButton.onclick = () => {
    feedbackElement.textContent = levels[currentLevel].hint || "No hint available.";
  };
  updateProgressBar(); // Update progress bar
  startTimer(15); // Start a 15-second timer
}

// Timer
function startTimer(seconds) {
  let timeRemaining = seconds;
  timerElement.textContent = `Time Left: ${timeRemaining}s`;
  timer = setInterval(() => {
    timeRemaining--;
    timerElement.textContent = `Time Left: ${timeRemaining}s`;
    if (timeRemaining <= 0) {
      clearInterval(timer);
      feedbackElement.textContent = "Time's up! Moving to the next level.";
      feedbackElement.style.color = "red";
      nextButton.classList.remove("hidden");
    }
  }, 1000);
}

// Handle Answer
function handleAnswer(isCorrect) {
  clearInterval(timer); // Stop the timer
  if (isCorrect) {
    score += 10; // Add 10 points for correct answer
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    runConfetti(); // Start confetti celebration
  } else {
    score -= 3; // Deduct 3 points for incorrect
    feedbackElement.textContent = "Incorrect!";
    feedbackElement.style.color = "red";
  }
  updateScore();
  nextButton.classList.remove("hidden");
}

// Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Confetti Fun!
function runConfetti() {
  const duration = 3000; // 3 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { spread: 360, startVelocity: 35, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
    } else {
      confetti({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: 0.6 } });
      confetti({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: 0.6 } });
    }
  }, 250);
}

// Update Score
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Go to Next Level
nextButton.addEventListener("click", () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
  } else {
    finishGame();
  }
});

// End Game
function finishGame() {
  document.getElementById("quiz-level").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("score").textContent = `${score}`;
  if (score >= minScoreForCertificate) {
    certificateSection.classList.remove("hidden");
  } else {
    certificateSection.classList.add("hidden");
  }
}

// Generate Certificate
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add Logo
  doc.addImage("https://cash.app/qr/click/7k
