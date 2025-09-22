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
    question: "Which of the following should NOT be used as a password?",
    options: [
      { text: "Your mother's maiden name.", isCorrect: false },
      { text: "A random string of letters, numbers, and special characters.", isCorrect: true },
      { text: "A combination of your name and birthday.", isCorrect: false }
    ]
  }
];

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);

// Function to Start the Game
function startGame() {
  currentLevel = 0; // Reset to the first level
  score = 0; // Reset score
  showLevel(); // Show the first level
}

// Function to Display the Current Level
function showLevel() {
  // Hide the welcome screen and show the quiz screen
  document.getElementById('welcome-screen').classList.add('hidden');
  document.getElementById('quiz-level').classList.remove('hidden');

  // Get the current level data
  const level = levels[currentLevel];
  const questionElement = document.getElementById('question');
  const optionsElement = document.querySelector('.options');
  const feedbackElement = document.getElementById('feedback'); // Get feedback element

  // Update the question text
  questionElement.textContent = level.question;

  // Clear old feedback and options
  feedbackElement.textContent = ""; // Reset feedback
  optionsElement.innerHTML = ""; // Clear options

  // Create option buttons
  level.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.text; // Add text to button
    button.classList.add('option'); // Add styling class
    button.addEventListener('click', () => handleAnswer(option.isCorrect)); // Add click event
    optionsElement.appendChild(button); // Append button to options container
  });

  // Update the progress bar
  const progress = ((currentLevel + 1) / levels.length) * 100; // Calculate percentage
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${progress}%`; // Update the width
}

// Function to Handle Answer Selection
function handleAnswer(isCorrect) {
  const nextButton = document.getElementById('next-question');
  const feedbackElement = document.getElementById('feedback'); // Get feedback element

  // Show feedback and update score
  if (isCorrect) {
    score += 10; // Add points for correct answer
    feedbackElement.textContent = "Correct! Great job!"; // Correct feedback
    feedbackElement.style.color = "green"; // Green for correct
  } else {
    feedbackElement.textContent = "Incorrect. Try again!"; // Incorrect feedback
    feedbackElement.style.color = "red"; // Red for incorrect
  }

  // Show the "Next Question" button to move forward
  nextButton.classList.remove('hidden');
}

// Function to Show the Next Level
function showNextQuestion() {
  currentLevel++; // Proceed to the next level

  // Check if there are more levels or if the game is over
  if (currentLevel < levels.length) {
    showLevel(); // Show the next level
    document.getElementById('next-question').classList.add('hidden'); // Hide the "Next" button
  } else {
    finishGame(); // End the game
  }
}

// Function to Finish the Game
function finishGame() {
  // Hide the quiz screen and show the end screen
  document.getElementById('quiz-level').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');

  // Show the player's final score
  document.getElementById('score').textContent = score;
}

// Function to Restart the Game
function restartGame() {
  // Reset everything and go back to the welcome screen
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
}
