// Game Variables
let score = 0; // Stores the score
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
      { text: "Manually locked accounts queued by Risk Machine Learning which have triggered offline ATO models. These accounts are investigated the same as Account Locks but have different tools to determine the resolve.", isCorrect: true },
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
  }
];

// Start Game Button Event
document.getElementById('start-btn').addEventListener('click', startGame);

// Start Game Function
function startGame() {
  score = 0;
  currentLevel = 0;
  showLevel();
}

// Show Current Level Function
function showLevel() {
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('quiz-level').classList.remove('hidden');

  const level = levels[currentLevel];
  document.getElementById('question').textContent = level.question;

  const optionsContainer = document.querySelector('.options');
  optionsContainer.innerHTML = "";

  level.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.text;
    button.classList.add('option');
    button.addEventListener('click', () => handleAnswer(option.isCorrect));
    optionsContainer.appendChild(button);
  });

  document.getElementById('feedback').textContent = "";
  updateProgressBar();
}

function handleAnswer(isCorrect) {
  const feedback = document.getElementById('feedback');
  const nextButton = document.getElementById('next-question');

  if (isCorrect) {
    feedback.textContent = "Correct! Great job!";
    feedback.style.color = "green";
    score += 10;
  } else {
    feedback.textContent = "Incorrect. Try again!";
    feedback.style.color = "red";
  }

  nextButton.classList.remove('hidden');
}

document.getElementById('next-question').addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    document.getElementById('next-question').classList.add('hidden');
  } else {
    finishGame();
  }
});

function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
}

function finishGame() {
  document.getElementById('quiz-level').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('score').textContent = score;
}

function restartGame() {
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
}
