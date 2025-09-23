// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
const minScoreForCertificate = 70; // Minimum score to qualify for certificate

// DOM Elements
const scoreTracker = document.getElementById('score-tracker');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const nextButton = document.getElementById('next-question');
const optionsContainer = document.querySelector('.options');
const questionElement = document.getElementById('question');
const certificateSection = document.getElementById('certificate-section');

// Define levels
const levels = [
  // Example questions (you can add more here)
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in to their account.", isCorrect: false },
      { text: "A malicious actor gains access to an account.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ]
  },
  {
    question: "Scenario: Fraud models flagged bulk accounts for suspicious logins. What do you do?",
    options: [
      { text: "Rollback suspicious activity.", isCorrect: true },
      { text: "Wait for customers to notify of an issue.", isCorrect: false },
      { text: "Ignore flagged data as incomplete.", isCorrect: false }
    ]
  },
  // Add more levels as needed
];

// Start game
document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show current level
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

  feedbackElement.textContent = ""; // Clear feedback
  updateProgressBar();
}

// Handle answer
function handleAnswer(isCorrect) {
  if (isCorrect) {
    score += 10;
    updateCheckpoint();
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
  } else {
    score -= 3;
    feedbackElement.textContent = "Incorrect.";
    feedbackElement.style.color = "red";
  }
  updateScore();
  nextButton.classList.remove('hidden');
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Update pathway checkpoints
function updateCheckpoint() {
  const checkpoint = document.getElementById(`checkpoint-${currentLevel + 1}`);
  if (checkpoint) {
    checkpoint.classList.add('active');
  }
}

// Update score
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Move to next question
nextButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
    nextButton.classList.add('hidden');
  } else {
    finishGame();
  }
});

// Finish game
function finishGame() {
  document.getElementById('quiz-level').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');
  document.getElementById('score').textContent = `${score}`;

  // Show certificate button if score is high enough
  if (score >= minScoreForCertificate) {
    certificateSection.classList.remove('hidden');
  } else {
    certificateSection.classList.add('hidden');
  }
}

// Generate certificate
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Certificate of Completion", 70, 50);
  doc.setFont("normal");
  doc.setFontSize(12);
  doc.text(`Congratulations on completing the Defend the Fort game!`, 20, 70);
  doc.text(`Your final score: ${score}`, 20, 90);

  doc.save("Certificate_of_Completion.pdf");
}

// Restart game
function restartGame() {
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
  score = 0;
  currentLevel = 0;
  updateProgressBar();
  resetCheckpoints();
}

// Reset checkpoints
function resetCheckpoints() {
  Array.from(document.getElementsByClassName('checkpoint')).forEach(cp => {
    cp.classList.remove('active');
  });
}
