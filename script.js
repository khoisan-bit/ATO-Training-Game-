// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
const minScoreForCertificate = 70; // Minimum score to unlock certificate

// DOM Elements
const scoreTracker = document.getElementById('score-tracker');
const progressBar = document.getElementById('progress-bar');
const feedbackElement = document.getElementById('feedback');
const optionsContainer = document.querySelector('.options');
const questionElement = document.getElementById('question');
const nextButton = document.getElementById('next-question');
const certificateSection = document.getElementById('certificate-section');

// Define all 9 levels with questions and answers
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in to their account.", isCorrect: false },
      { text: "A malicious actor gains access to an account.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ]
  },
  {
    question: "What’s the first action to take for flagged suspicious activity?",
    options: [
      { text: "Allow the activity to continue.", isCorrect: false },
      { text: "Investigate the flagged activity for potential risks.", isCorrect: true },
      { text: "Ignore flagged activity since the system has secured the account.", isCorrect: false }
    ]
  },
  {
    question: "What’s a common method attackers use in account takeovers?",
    options: [
      { text: "Phishing emails to steal credentials.", isCorrect: true },
      { text: "Regular account activity.", isCorrect: false },
      { text: "Browsing the web anonymously.", isCorrect: false }
    ]
  },
  {
    question: "Scenario 1: A flagged account shows multiple geographically distant logins. What do you do?",
    options: [
      { text: "Rollback suspicious activity flagged by the system.", isCorrect: true },
      { text: "Take no further action, as the fraud system secured the account.", isCorrect: false },
      { text: "Escalate to engineering without reviewing flagged activity.", isCorrect: false }
    ]
  },
  {
    question: "Scenario 2: A flagged payment exceeds historical averages. What’s your first step?",
    options: [
      { text: "Validate flagged payment and rollback fraudulent transactions.", isCorrect: true },
      { text: "Escalate the case to engineering without reviewing the activity.", isCorrect: false },
      { text: "Assume the payment is legitimate and ignore it.", isCorrect: false }
    ]
  },
  {
    question: "Scenario 3: Multiple accounts are flagged for inauthentic activity. What’s your next step?",
    options: [
      { text: "Investigate flagged accounts for behavior trends and verify fraud activity.", isCorrect: true },
      { text: "Rollback all account activity without further investigation.", isCorrect: false },
      { text: "Notify customers that their accounts are flagged as fraudulent.", isCorrect: false }
    ]
  },
  {
    question: "Scenario 4: Bulk login patterns have been flagged. What should you do?",
    options: [
      { text: "Rollback suspicious activity and document patterns for fraud trends.", isCorrect: true },
      { text: "Close all flagged accounts immediately.", isCorrect: false },
      { text: "Ignore flagged activity until customers report issues.", isCorrect: false }
    ]
  },
  {
    question: "Scenario 5: Phishing-related IP flagged multiple accounts. What should you do next?",
    options: [
      { text: "Rollback flagged activity while keeping accounts secured.", isCorrect: true },
      { text: "Ignore flagged IP activity and wait for further system actions.", isCorrect: false },
      { text: "Notify manual teams for further reviews without rollback.", isCorrect: false }
    ]
  },
  {
    question: "What is your first investigative step for flagged activity?",
    options: [
      { text: "Validate activity against historical account behaviors.", isCorrect: true },
      { text: "Immediately escalate all flagged accounts for manual review.", isCorrect: false },
      { text: "Close accounts without verifying flagged behavior.", isCorrect: false }
    ]
  }
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

// Handle Answer
function handleAnswer(isCorrect) {
  if (isCorrect) {
    score += 10;
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    runConfetti(); // Run confetti for correct answers
  } else {
    score -= 3;
    feedbackElement.textContent = "Incorrect.";
    feedbackElement.style.color = "red";
  }
  updateScore();
  nextButton.classList.remove('hidden');
}

// Trigger Confetti
function runConfetti() {
  const duration = 3000; // 3 seconds
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

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: 0.7 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: 0.7 } });
  }, 250);
}

// Update Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Score Tracker
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Handle Next Question or End Game
nextButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    nextButton.classList.add('hidden');
  } else {
    finishGame();
  }
});

// Finish Game
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
  doc.text("Certificate of Completion", 70, 50);
  doc.text(`Congratulations! Final Score: ${score}`, 50, 80);
  doc.text("Successfully completed the Defend the Fort game.", 40, 100);
  doc.save("Certificate_of_Completion.pdf");
}

// Restart Game
function restartGame() {
  location.reload(); // Reload the page to start fresh
}
