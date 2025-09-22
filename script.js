// script.js
let score = 0;
let currentLevel = 0;

const levels = [
  // Quiz Level
  {
    id: 'quiz-level',
    question: 'What is an account takeover (ATO)?',
    options: [
      { text: 'A) A legitimate customer logs in to their account.', correct: false },
      { text: 'B) A malicious actor gains access to an account without authorization.', correct: true },
      { text: 'C) A customer voluntarily shares their account details with another person.', correct: false }
    ]
  },
  // Spot the Red Flags Level
  {
    id: 'red-flag-level',
    question: 'What should you do when detecting a suspicious login?',
    options: [
      { text: 'A) Block the account.', correct: true },
      { text: 'B) Notify the user.', correct: false },
      { text: 'C) Allow activity to continue.', correct: false }
    ]
  }
];

// Show welcome screen
document.getElementById('start-btn').addEventListener('click', () => showLevel(0));

function showLevel(levelIndex) {
  // Hide all levels
  document.querySelectorAll('.hidden').forEach(screen => {
    screen.classList.add('hidden');
  });

  // Show selected level
  document.getElementById(levels[levelIndex].id).classList.remove('hidden');
  if (levels[levelIndex].id === 'quiz-level') {
    document.getElementById('question').textContent = levels[levelIndex].question;
  }
  currentLevel = levelIndex;
}

function checkAnswer(button, isCorrect) {
  if (isCorrect) {
    score += 10;
    button.style.backgroundColor = 'green';
  } else {
    button.style.backgroundColor = 'red';
  }
  document.getElementById('next-question')?.classList.remove('hidden');
  if (currentLevel === levels.length - 1) {
    document.getElementById('finish-game')?.classList.remove('hidden');
  }
}

function showNextQuestion() {
  if (currentLevel + 1 < levels.length) {
    showLevel(currentLevel + 1);
  }
}

function finishGame() {
  document.querySelectorAll('.hidden').forEach(screen => screen.classList.add('hidden'));
  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('score').textContent = score;
}

function restartGame() {
  score = 0;
  showLevel(0);
}