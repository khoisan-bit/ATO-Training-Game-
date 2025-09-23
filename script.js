// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level

// Define the levels
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in to their account.", isCorrect: false },
      { text: "A malicious actor gains access to an account.", isCorrect: true },
      { text: "A customer voluntarily shares their credentials.", isCorrect: false }
    ]
  },
  {
    question: "What’s the first action to take for suspicious activity?",
    options: [
      { text: "Allow the activity to continue.", isCorrect: false },
      { text: "Block the account for further investigation.", isCorrect: true },
      { text: "Notify the user before taking action.", isCorrect: false }
    ]
  },
  {
    question: "What’s a common method attackers use in account takeovers?",
    options: [
      { text: "Phishing emails to steal credentials.", isCorrect: true },
      { text: "Regular account activity.", isCorrect: false },
      { text: "Browsing the internet anonymously.", isCorrect: false }
    ]
  },
  {
    question: "What is phishing?",
    options: [
      { text: "Stealing account details through fake emails.", isCorrect: true },
      { text: "Browsing the web with security software.", isCorrect: false },
      { text: "Copying files legally via cloud storage.", isCorrect: false }
    ]
  },
  {
    question: "Which of the following should be used as a password?",
    options: [
      { text: "Your mother's maiden name.", isCorrect: false },
      { text: "A random string of letters, numbers, and special characters.", isCorrect: true },
      { text: "A combination of your name and birthday.", isCorrect: false }
    ]
  }
];

// DOM Elements
const scoreTracker = document.getElementById('score-tracker');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const nextButton = document.getElementById('next-question');
const optionsContainer = document.querySelector('.options');
const questionElement = document.getElementById('question');

// Start Game Button Event
document.getElementById('start-btn').addEventListener('click', startGame);

// Start Game Function
function startGame() {
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show Current Level Function
function showLevel() {
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('quiz-level').classList.remove('hidden');

  const level = levels[currentLevel];
  questionElement.textContent = level.question;

  optionsContainer.innerHTML = ""; // Clear old options
  
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
    updateScore();
    runConfetti(); // Trigger confetti for correct answers
    feedbackElement.textContent = "Correct! Well done!";
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.textContent = "Incorrect. Try again!";
    feedbackElement.style.color = "red";
  }
  nextButton.classList.remove('hidden');
}

// Custom Confetti Function
function runConfetti() {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: {
        x: randomInRange(0.1, 0.3),
        y: Math.random() - 0.2,
      },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: {
        x: randomInRange(0.7, 0.9),
        y: Math.random() - 0.2,
      },
    });
  }, 250);
}

// Update Score Dynamically
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`; // Update score tracker
}

// Update Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Next Question Button Event
nextButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    nextButton.classList.add('hidden');
  } else {
    finishGame();
  }
});

// Finish Game Function
function finishGame() {
  document.getElementById('quiz-level').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('score').textContent = score; // Show final score
}

// Restart Game
function restartGame() {
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
}
