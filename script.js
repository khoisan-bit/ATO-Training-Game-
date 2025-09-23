// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
const minScoreForCertificate = 70; // Minimum score to unlock the certificate

// DOM Elements
const scoreTracker = document.getElementById('score-tracker');
const progressBar = document.getElementById('progress-bar');
const feedbackElement = document.getElementById('feedback');
const optionsContainer = document.querySelector('.options');
const questionElement = document.getElementById('question');
const nextButton = document.getElementById('next-question');
const certificateSection = document.getElementById('certificate-section');

// Define All Questions
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in.", isCorrect: false },
      { text: "A malicious actor gains access.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ]
  },
  {
    question: "What’s the first action to take for flagged suspicious activity?",
    options: [
      { text: "Allow the activity to continue.", isCorrect: false },
      { text: "Investigate flagged activity for potential risks.", isCorrect: true },
      { text: "Ignore flagged activity as the system has secured the account.", isCorrect: false }
    ]
  },
  {
    question: "What’s a common method attackers use in account takeovers?",
    options: [
      { text: "Phishing emails to steal credentials.", isCorrect: true },
      { text: "Regular account activity.", isCorrect: false },
      { text: "Using VPNs anonymously.", isCorrect: false }
    ]
  },
  {
    question: "Which is a red flag of phishing?",
    options: [
      { text: "Legitimate sender email address.", isCorrect: false },
      { text: "Generic salutations like 'Dear Customer'.", isCorrect: true },
      { text: "Proper spelling and grammar.", isCorrect: false }
    ]
  },
  {
    question: "What is a Bulk Lock?",
    options: [
      {
        text: "Manually locked accounts queued by Risk Machine Learning which have triggered offline ATO models. These accounts are investigated the same as Account Locks but have different tools to determine the resolve.",
        isCorrect: true
      },
      { text: "Random accounts that are just locked.", isCorrect: false },
      { text: "A lock in bulk.", isCorrect: false }
    ]
  },
  {
    question: "Which is NOT a signal of an Inauthentic Account?",
    options: [
      { text: "Patterns of suspicious activity.", isCorrect: false },
      { text: "Lack legitimate transaction patterns.", isCorrect: false },
      { text: "Customer name, identity documents (driver's license), and selfie all match the customer.", isCorrect: true }
    ]
  },
  {
    question: "Where is the ATO Locks queue located?",
    options: [
      { text: "CF1.", isCorrect: false },
      { text: "Notary.", isCorrect: true },
      { text: "A spreadsheet.", isCorrect: false }
    ]
  },
  {
    question: "What does #ATO_INV_LATO stand for?",
    options: [
      { text: "Completed ATO Lock Investigation.", isCorrect: true },
      { text: "Locks touched this account.", isCorrect: false },
      { text: "The account has been reset.", isCorrect: false }
    ]
  },
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

// Handle Answers
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

// Confetti Animation
function runConfetti() {
  const duration = 3 * 1000; // 3 seconds of confetti
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({ ...defaults, particleCount: 50, origin: { x: Math.random(), y: 0.5 } });
  }, 250);
}

// Update Score Tracker
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Update Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Advance to Next Question or End Game
nextButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    nextButton.classList.add('hidden');
  } else {
    finishGame();
  }
});

// Finish the Game
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

// Generate Certificate
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Certificate of Completion", 70, 50);
  doc.text(`Congratulations! You scored ${score}.`, 40, 80);
  doc.text("Successfully completed the Defend the Fort game.", 40, 100);
  doc.save("Certificate_of_Completion.pdf");
}

// Restart Game
function restartGame() {
  location.reload(); // Reloads the game
}
