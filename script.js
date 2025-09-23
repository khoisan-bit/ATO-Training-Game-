// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
const minScoreForCertificate = 70; // Minimum score to qualify for a certificate

// DOM Elements
const scoreTracker = document.getElementById('score-tracker');
const progressBar = document.getElementById('progress-bar');
const feedbackElement = document.getElementById('feedback');
const optionsContainer = document.querySelector('.options');
const questionElement = document.getElementById('question');
const nextButton = document.getElementById('next-question');
const certificateSection = document.getElementById('certificate-section');

// Define levels
const levels = [
  { question: "What is an account takeover (ATO)?", options: [
      { text: "A legitimate customer logs in.", isCorrect: false },
      { text: "A malicious actor gains access.", isCorrect: true },
    ]
  },
  { question: "Scenario: Suspicious login flagged. What’s your next step?", options: [
      { text: "Rollback flagged activity.", isCorrect: true },
      { text: "Ignore flagged activity.", isCorrect: false },
    ]
  },
  // Add your other questions and scenarios here (up to 9 total levels)
];

// Start Game
document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show Current Level
function showLevel() {
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('quiz-level').classList.remove('hidden');

  const level = levels[currentLevel];
  questionElement.textContent = level.question;

  optionsContainer.innerHTML = ""; // Clear previous options
  level.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.text;
    button.classList.add('option');
    button.addEventListener('click', () => handleAnswer(option.isCorrect));
    optionsContainer.appendChild(button);
  });

  feedbackElement.textContent = ""; // Clear feedback text
  updateProgressBar();
}

// Handle Answer Selection
function handleAnswer(isCorrect) {
  if (isCorrect) {
    score += 10;
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    runConfetti(); // Trigger confetti for correct answers
  } else {
    score -= 3;
    feedbackElement.textContent = "Incorrect.";
    feedbackElement.style.color = "red";
  }
  updateScore();
  nextButton.classList.remove('hidden');
}

// Run Confetti for 3 Seconds
function runConfetti() {
  const duration = 3 * 1000; // Confetti duration: 3 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration); // Dynamic confetti particles
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: 0.7 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: 0.7 } });
  }, 250);
}

// Update Score
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Update Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Finish Game
nextButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    nextButton.classList.add('hidden');
  } else {
    finishGame();
  }
});

// Game Completion Logic
function finishGame() {
  document.getElementById('quiz-level').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('score').textContent = score;

  if (score >= minScoreForCertificate) {
    certificateSection.classList.remove('hidden');
  } else {
    certificateSection.classList.add('hidden');
  }
}

// Generate PDF Certificate
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Certificate of Completion", 70, 50);
  doc.text(`Congratulations! You scored ${score}`, 50, 80);
  doc.text("Successfully completed the Defend the Fort game.", 40, 100);
  doc.save("Certificate_of_Completion.pdf");
}

// Restart Game
function restartGame() {
  location.reload(); // Reload the page
}
