// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
let timer; // Timer for each question
const minScoreForCertificate = 70; // Minimum score to unlock certificate
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

// Question Array with All 14 Questions and Hints
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in.", isCorrect: false },
      { text: "A malicious actor gains access.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ],
    hint: "Hint: ATO involves unauthorized access using stolen credentials."
  },
  {
    question: "Which is a red flag of phishing?",
    options: [
      { text: "Legitimate sender email address.", isCorrect: false },
      { text: "Generic salutations like 'Dear Customer'.", isCorrect: true },
      { text: "Proper spelling and grammar.", isCorrect: false }
    ],
    hint: "Hint: Phishing often uses generic greetings like 'Dear Customer'."
  },
  {
    question: "What is a Bulk Lock?",
    options: [
      {
        text: "Manually locked accounts queued by Risk Machine Learning which have triggered offline ATO models.",
        isCorrect: true
      },
      { text: "Random accounts that are just locked.", isCorrect: false },
      { text: "A lock in bulk.", isCorrect: false }
    ],
    hint: "Hint: Bulk Locks involve accounts flagged by models based on fraudulent behavior."
  },
  {
    question: "Which is NOT a signal of an Inauthentic Account?",
    options: [
      { text: "Patterns of suspicious activity.", isCorrect: false },
      { text: "Lack legitimate transaction patterns.", isCorrect: false },
      { text: "Customer name, identity documents, and selfie match.", isCorrect: true }
    ],
    hint: "Hint: A real account's documentation would appear to match."
  },
  {
    question: "Where is the ATO Locks queue located?",
    options: [
      { text: "CF1", isCorrect: false },
      { text: "Notary", isCorrect: true },
      { text: "A spreadsheet", isCorrect: false }
    ],
    hint: "Hint: ATO Locks queue is part of your organization's Notary system."
  },
  {
    question: "What does #ATO_INV_LATO stand for?",
    options: [
      { text: "Completed ATO Lock Investigation.", isCorrect: true },
      { text: "Locks touched this account.", isCorrect: false },
      { text: "The account has been reset.", isCorrect: false }
    ],
    hint: "Hint: #ATO_INV_LATO refers to investigations completed for flagged accounts."
  },
  {
    question: "What’s the first step for flagged suspicious activity?",
    options: [
      { text: "Allow activity to continue.", isCorrect: false },
      { text: "Investigate the flagged activity.", isCorrect: true },
      { text: "Ignore the flagged alert.", isCorrect: false }
    ],
    hint: "Hint: Always review flagged activity to assess fraud risks."
  },
  {
    question: "What’s a common method attackers use in account takeovers?",
    options: [
      { text: "Phishing emails to steal credentials.", isCorrect: true },
      { text: "Secure logins from legitimate sources.", isCorrect: false },
      { text: "Monitoring accounts offline.", isCorrect: false }
    ],
    hint: "Hint: Attackers often use phishing to trick users into sharing credentials."
  }
];

// Event Listeners
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  playerName = document.getElementById("player-name").value;
  if (!playerName) {
    alert("Please enter your name to start the game!");
    return;
  }
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show Level
function showLevel() {
  clearInterval(timer);
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("quiz-level").classList.remove("hidden");
  const level = levels[currentLevel];
  questionElement.textContent = level.question;

  optionsContainer.innerHTML = ""; // Reset options
  level.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.classList.add("option");
    button.addEventListener("click", () => handleAnswer(option.isCorrect));
    optionsContainer.appendChild(button);
  });

  feedbackElement.textContent = ""; // Clear feedback
  nextButton.classList.add("hidden"); // Hide next button
  hintButton.classList.remove("hidden"); // Show hint

  if (level.hint) {
    hintButton.onclick = () => {
      feedbackElement.textContent = level.hint;
      feedbackElement.style.color = "#007bff";
    };
  } else {
    hintButton.classList.add("hidden");
  }

  updateProgressBar();
  startTimer(15); // Start a 15-second timer
}

// Timer Function
function startTimer(duration) {
  let timeRemaining = duration;
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
  clearInterval(timer);
  feedbackElement.style.color = isCorrect ? "green" : "red";
  feedbackElement.textContent = isCorrect ? "Correct!" : "Incorrect.";
  score += isCorrect ? 10 : -3;

  updateScore();
  nextButton.classList.remove("hidden");
}

// Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Update Score
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Move to Next Level
nextButton.addEventListener("click", () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
  } else {
    finishGame();
  }
});

// End Game Logic
function finishGame() {
  document.getElementById("quiz-level").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("score").textContent = `${score}`;
  certificateSection.style.display = score >= minScoreForCertificate ? "block" : "none";
}

// Certificate PDF
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // Add logo + personalized text
  doc.addImage(
    "https://cash.app/qr/click/7k8xwvgg?margin=0&logoColor=00e013&bg=000000&fg=FFFFFF&format=svg",
    "SVG",
    30,
    10,
    150,
    30
  );
  doc.setFontSize(22).setFont("helvetica", "bold");
  doc.text("Certificate of Completion", 105, 60, null, null, "center");
  doc.text(`Awarded to: ${playerName}`, 105, 90, null, null, "center");
  doc.setFontSize(14).text(`Your Score: ${score}`, 105, 110, null, null, "center");
  doc.text("Congratulations on completing Defend the Fort!", 105, 130, null, null, "center");
  doc.save(`${playerName}-Certificate.pdf`);
}

// Restart Game
function restartGame() {
  location.reload();
}
