const levels = [
  {
    question: "What is an account takeover (ATO)?",
    answers: [
      { text: "Gaining unauthorized access to a user’s account", correct: true },
      { text: "Creating multiple accounts for testing", correct: false },
      { text: "Locking accounts after password attempts", correct: false }
    ],
    hint: "Think about unauthorized actions on legitimate accounts."
  },
  {
    question: "What is the first step in responding to a detected ATO?",
    answers: [
      { text: "Rollback the user's account to a safe state", correct: true },
      { text: "Lock the account immediately", correct: false },
      { text: "Notify the affected user", correct: false }
    ],
    hint: "Consider company policy on 'rollback' vs. 'lock'."
  },
  // Add more levels as needed...
];

let currentLevel = 0;
let score = 0;
let timer;
const maxTime = 20;

const questionScreen = document.getElementById("question-screen");
const welcomeScreen = document.getElementById("welcome-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const questionTitle = document.getElementById("question-title");
const answersContainer = document.getElementById("answers");
const hintText = document.getElementById("hint-text");
const hintButton = document.getElementById("hint-button");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const finalScore = document.getElementById("final-score");
const downloadCertificateButton = document.getElementById("download-certificate");

// Event Listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  location.reload();
});
hintButton.addEventListener("click", showHint);
downloadCertificateButton.addEventListener("click", generateCertificate);

function startGame() {
  welcomeScreen.style.display = "none";
  questionScreen.style.display = "block";
  score = 0;
  currentLevel = 0;
  showQuestion();
}

function showQuestion() {
  const level = levels[currentLevel];
  questionTitle.textContent = level.question;
  answersContainer.innerHTML = "";
  hintText.textContent = "";

  level.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.onclick = () => handleAnswer(answer.correct);
    answersContainer.appendChild(button);
  });

  startTimer();
}

function handleAnswer(correct) {
  if (correct) {
    score += 10;
    displayConfetti();
  }
  currentLevel++;
  updateProgressBar();

  if (currentLevel < levels.length) {
    showQuestion();
  } else {
    endGame();
  }
}

function startTimer() {
  let timeLeft = maxTime;
  timerElement.textContent = `Time Remaining: ${timeLeft}`;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Remaining: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(false);
    }
  }, 1000);
}

function showHint() {
  hintText.textContent = levels[currentLevel].hint;
}

function updateProgressBar() {
  progressBar.style.width = `${(currentLevel / levels.length) * 100}%`;
}

function displayConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endGame() {
  questionScreen.style.display = "none";
  resultScreen.style.display = "block";
  clearInterval(timer);
  finalScore.textContent = `Your Score: ${score}`;
  downloadCertificateButton.style.display = score >= 70 ? "block" : "none";
}

function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Certificate of Completion", 20, 30);
  doc.text(`Congrats! You scored ${score}`, 20, 50);
  doc.save("certificate.pdf");
}
