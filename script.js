// Store game progress
let score = 0;
let currentLevel = 0;

// Define levels
const levels = [
  // Level 1
  {
    id: 'quiz-level',
    question: 'What is an account takeover (ATO)?',
    options: [
      { text: 'A) A legitimate customer logs in to their account.', correct: false },
      { text: 'B) A malicious actor gains access to an account without authorization.', correct: true },
      { text: 'C) A customer voluntarily shares their account details with another person.', correct: false }
    ]
  },
  // Additional levels can go here!
];

// Start the game when "Start Game" is clicked
document.getElementById('start-btn').addEventListener('click', () => showLevel(0));

function showLevel(levelIndex) {
  // Hide all sections
  document.querySelectorAll('.hidden').forEach(screen => screen.classList.add('hidden'));

  // Show the current level
  document.getElementById(levels[levelIndex].id).classList.remove('hidden');

  // Update the question text
  document.getElementById('question').textContent = levels[levelIndex].question;

  // Update progress bar
  updateProgress(levelIndex);

  // Save current level
  currentLevel = levelIndex;
}

function updateProgress(levelIndex) {
  const progress = ((levelIndex + 1) / levels.length) * 100; // Calculate percentage
  document.getElementById('progress-bar').style.width = progress + '%'; // Update bar
}

function checkAnswer(button, isCorrect) {
  if (isCorrect) {
    score += 10; // Increase score for correct answer
    button.style.backgroundColor = 'green';
  } else {
    button.style.backgroundColor = 'red';
  }
  document.getElementById('next-question').classList.remove('hidden'); // Show next button
}

function showNextQuestion() {
  if (currentLevel + 1 < levels.length) {
    showLevel(currentLevel + 1); // Go to next level
  } else {
    finishGame();
  }
}

function finishGame() {
  // Hide all sections
  document.querySelectorAll('.hidden').forEach(screen => screen.classList.add('hidden'));

  // Show end screen
  document.getElementById('end-screen').classList.remove('hidden');

  // Display final score
  document.getElementById('score').textContent = score;
}

function restartGame() {
  // Reset the game
  score = 0;
  showLevel(0); // Start from the beginning
}