// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
let timer; // Timer for questions
const minScoreForCertificate = 70; // Minimum score to unlock certificate

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

// Define All 14 Questions
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in.", isCorrect: false },
      { text: "A malicious actor gains access.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ],
    hint: "Hint: ATO occurs when someone uses stolen credentials to access an account."
  },
  {
    question: "Which is a red flag of phishing?",
    options: [
      { text: "Legitimate sender email address.", isCorrect: false },
      { text: "Generic salutations like 'Dear Customer'.", isCorrect: true },
      { text: "Proper spelling and grammar.", isCorrect: false }
    ],
    hint: "Hint: Phishing often uses generic greetings to disguise fraudulent activity."
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
    hint: "Hint: Bulk Locks are flagged by machine learning algorithms."
  },
  {
    question: "Which is NOT a signal of an inauthentic account?",
    options: [
      { text: "Patterns of suspicious activity.", isCorrect: false },
      { text: "Lack legitimate transaction patterns.", isCorrect: false },
      { text: "Customer name, identity, and documents all match.", isCorrect: true }
    ],
    hint: "Hint: Authentic accounts usually have matching names and documents."
  },
  {
    question: "Where is the ATO Locks queue located?",
    options: [
      { text: "CF1", isCorrect: false },
      { text: "Notary", isCorrect: true },
      { text: "A spreadsheet", isCorrect: false }
    ],
    hint: "Hint: The ATO Locks queue is part of the Notary system."
  },
  {
    question: "What does #ATO_INV_LATO stand for?",
    options: [
      { text: "Completed ATO Lock Investigation.", isCorrect: true },
      { text: "Locks touched this account.", isCorrect: false },
      { text: "The account has been reset.", isCorrect: false }
    ],
    hint: "Hint: This refers to completed ATO investigations."
  },
  {
    question: "Scenario: Flagged activity from unusual locations is detected. What now?",
    options: [
      { text: "Investigate and rollback suspicious activity.", isCorrect: true },
      { text: "Wait for the customer to report more details.", isCorrect: false },
      { text: "Ignore the flagged activity.", isCorrect: false }
    ],
    hint: "Hint: Always rollback unusual account activity when flagged."
  },
  {
    question: "Scenario: Fraud models flagged several accounts for account takeover behaviors. What's your first step?",
    options: [
      { text: "Verify flagged account activity before further escalation.", isCorrect: true },
      { text: "Assume fraud and close affected accounts immediately.", isCorrect: false },
      { text: "Continue monitoring without further action.", isCorrect: false }
    ],
    hint: "Hint: Proper verification helps prevent innocent accounts being affected."
  },
  {
    question: "Scenario: Payment far exceeds normal transaction limits. What to do?",
    options: [
      { text: "Validate the flagged payment to identify fraud.", isCorrect: true },
      { text: "Reverse the payment immediately.", isCorrect: false },
      { text: "Assume fraud and escalate without further review.", isCorrect: false }
    ],
    hint: "Hint: Fraudulent payments must be validated appropriately."
  },
  {
    question: "Which behavior is considered a signal of phishing?",
    options: [
      { text: "Filtered content.", isCorrect: false },
      { text: "URLs that look identical to authorized domains.", isCorrect: true },
      { text: "Localized financial links.", isCorrect: false }
    ],
    hint: "Hint: Phishing often masks the real website with convincing URLs."
  },
  {
    question: "Scenario: Login attempts came from flagged phishing IPs. What's next?",
    options: [
      { text: "Rollback activity tied to flagged IPs and secure.", isCorrect: true },
      { text: "Ignore activity unless unauthorized access occurs.", isCorrect: false },
      { text: "Immediately escalate to engineering without rollback.", isCorrect: false }
    ],
    hint: "Hint: Always rollback flagged phishing activity."
  },
  {
    question: "What's your first action on flagged transaction logs?",
    options: [
      { text: "Rollback suspicious payment behaviors flagged in detection.", isCorrect: true },
      { text: "Ignore flagged patterns unless additional logs are consistent.", isCorrect: false },
      { text: "Skip nonbusiness logs in legal frameworks automatically.", isCorrect: false }
    ],
    hint: "Hint: Ensure systematic rollbacks occur across transaction types."
  },
  {
    question: "...", 
    "Behavior Test."
    ]}
,"\Remaining;;;`
Apologies for the abrupt end of the response earlier! Let me complete the **full, functional script** including all **14 questions**, ensuring everything works properly.

Below is the **fully completed version** of the `script.js` file that includes:
- All **14 questions**.
- Confetti animations for correct answers.
- Timer functionality for each question.
- Hints for select questions.
- A download certificate button for a generic certificate (no player name or graphic).

---

### **Final `script.js`**
```javascript
// Game Variables
let score = 0; // Player's score
let currentLevel = 0; // Tracks the current level
let timer; // Timer for the question
const minScoreForCertificate = 70; // Minimum score to unlock the certificate

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

// Define All 14 Questions
const levels = [
  {
    question: "What is an account takeover (ATO)?",
    options: [
      { text: "A legitimate customer logs in.", isCorrect: false },
      { text: "A malicious actor gains access.", isCorrect: true },
      { text: "A customer voluntarily shares credentials.", isCorrect: false }
    ],
    hint: "Hint: ATO occurs when someone uses stolen credentials to access an account."
  },
  {
    question: "Which is a red flag of phishing?",
    options: [
      { text: "Legitimate sender email address.", isCorrect: false },
      { text: "Generic salutations like 'Dear Customer'.", isCorrect: true },
      { text: "Proper spelling and grammar.", isCorrect: false }
    ],
    hint: "Hint: Phishing often uses generic greetings to disguise fraudulent activity."
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
    hint: "Hint: Bulk Locks are flagged by machine learning algorithms."
  },
  {
    question: "Which is NOT a signal of an inauthentic account?",
    options: [
      { text: "Patterns of suspicious activity.", isCorrect: false },
      { text: "Lack legitimate transaction patterns.", isCorrect: false },
      { text: "Customer name, identity, and documents all match.", isCorrect: true }
    ],
    hint: "Hint: Authentic accounts usually have matching names and documents."
  },
  {
    question: "Where is the ATO Locks queue located?",
    options: [
      { text: "CF1", isCorrect: false },
      { text: "Notary", isCorrect: true },
      { text: "A spreadsheet", isCorrect: false }
    ],
    hint: "Hint: The ATO Locks queue is part of the Notary system."
  },
  {
    question: "What does #ATO_INV_LATO stand for?",
    options: [
      { text: "Completed ATO Lock Investigation.", isCorrect: true },
      { text: "Locks touched this account.", isCorrect: false },
      { text: "The account has been reset.", isCorrect: false }
    ],
    hint: "Hint: This refers to completed ATO investigations."
  },
  {
    question: "Flagged activity from unusual locations is detected. What now?",
    options: [
      { text: "Investigate and rollback suspicious activity.", isCorrect: true },
      { text: "Wait for the customer to report more details.", isCorrect: false },
      { text: "Ignore the flagged activity.", isCorrect: false }
    ],
    hint: "Hint: Always rollback flagged unusual activity to secure accounts."
  },
  {
    question: "Fraud models flagged accounts for ATO behaviors. What's your first step?",
    options: [
      { text: "Verify flagged account activity before escalation.", isCorrect: true },
      { text: "Assume fraud and close affected accounts immediately.", isCorrect: false },
      { text: "Continue monitoring without taking any action.", isCorrect: false }
    ],
    hint: "Hint: Verification ensures accuracy before any action."
  },
  {
    question: "A flagged payment far exceeds normal transaction patterns. What to do?",
    options: [
      { text: "Validate flagged payment for fraud.", isCorrect: true },
      { text: "Reverse the payment immediately.", isCorrect: false },
      { text: "Assume fraud without any validation.", isCorrect: false }
    ],
    hint: "Hint: Fraudulent payments must always be validated first."
  },
  {
    question: "Which behavior matches phishing-related activity?",
    options: [
      { text: "Identical URLs to authorized domains.", isCorrect: true },
      { text: "Regularly used email addresses.", isCorrect: false },
      { text: "Localized financial links.", isCorrect: false }
    ],
    hint: "Hint: Phishing usually disguises links to look legitimate."
  },
  {
    question: "Login attempts flagged from phishing IPs. What's next?",
    options: [
      { text: "Rollback activity tied to flagged IPs.", isCorrect: true },
      { text: "Ignore unless unauthorized access occurs.", isCorrect: false },
      { text: "Escalate without any rollback.", isCorrect: false }
    ],
    hint: "Hint: Always rollback activity tied to phishing indicators."
  },
  {
    question: "Scenario: How do you handle flagged transaction logs?",
    options: [
      { text: "Rollback flagged payment behaviors.", isCorrect: true },
      { text: "Skip unless repeated evidence is flagged.", isCorrect: false },
      { text: "Ignore flagged logs entirely.", isCorrect: false }
    ],
    hint: "Hint: Rollbacks are essential for securing financial activity."
  },
  {
    question: "A suspicious sender profile flagged repeated phishing. What do you do?",
    options: [
      { text: "Investigate senders and notify fraud teams.", isCorrect: true },
      { text: "Ignore sender account patterns flagged this week.", isCorrect: false },
      { text: "Assume phishing but ignore it due to low risk.", isCorrect: false }
    ]
  },
  {
    question: "Unusual signup patterns were flagged in bulk. Response?",
    options: [
      { text: "Analyze flagged bulk before investigation escalation.", isCorrect: true },
      { text: "Ignore patterns from 50% high traffic zones.", isCorrect: false },
      { text: "Wait to monitor for upgraded suspicious indicators.", isCorrect: false }
    ]
  }
];

// Initialize the Game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  score = 0;
  currentLevel = 0;
  updateScore();
  showLevel();
}

// Show Current Level
function showLevel() {
  clearInterval(timer); // Clear any existing timer
  const level = levels[currentLevel];

  // Update question text
  questionElement.textContent = level.question;

  // Populate options
  optionsContainer.innerHTML = ""; // Clear old options
  level.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = () => handleAnswer(option.isCorrect);
    button.classList.add("option");
    optionsContainer.appendChild(button);
  });

  // Handle Hint Button
  feedbackElement.textContent = "";
  if (level.hint) {
    hintButton.classList.remove("hidden");
    hintButton.onclick = () => (feedbackElement.textContent = level.hint);
  } else {
    hintButton.classList.add("hidden");
  }

  // Update Progress Bar and Start Timer
  updateProgressBar();
  startTimer(15); // Start a 15-second timer
}

// Timer Functionality
function startTimer(seconds) {
  let timeRemaining = seconds;
  timerElement.textContent = `Time Left: ${timeRemaining}s`;

  timer = setInterval(() => {
    timeRemaining--;
    timerElement.textContent = `Time Left: ${timeRemaining}s`;

    if (timeRemaining <= 0) {
      clearInterval(timer);
      feedbackElement.textContent = "Time's up! Moving to the next question.";
      feedbackElement.style.color = "red";
      nextButton.classList.remove("hidden");
    }
  }, 1000);
}

// Handle Answers and Feedback
function handleAnswer(isCorrect) {
  clearInterval(timer); // Stop Timer
  if (isCorrect) {
    score += 10;
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
    runConfetti();
  } else {
    score -= 3;
    feedbackElement.textContent = "Incorrect!";
    feedbackElement.style.color = "red";
  }
  updateScore();
  nextButton.classList.remove("hidden");
}

// Confetti for Correct Answers
function runConfetti() {
  const duration = 3 * 1000; // 3 seconds
  const animationEnd = Date.now() + duration;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      angle: randomInRange(55, 125),
      spread: 55,
      origin: { x: 0.5, y: 0.5 }
    });
  }, 250);
}

// Update Progress Bar
function updateProgressBar() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Update Score
function updateScore() {
  scoreTracker.textContent = `Score: ${score}`;
}

// Proceed to Next Question or Game End
nextButton.addEventListener("click", () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    showLevel();
  } else {
    finishGame();
  }
});

// End the Game
function finishGame() {
  document.getElementById("quiz-level").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("score").textContent = `${score
