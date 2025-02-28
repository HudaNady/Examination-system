class Answer {
  constructor(option, isCorrect) {
    this.option = option;
    this.isCorrect = isCorrect;
  }
}

class Question {
  constructor(q, answers) {
    this.question = q;
    this.answers = answers;
  }
}

function randomizeQ(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let loader = document.querySelector(".load");
let error = document.querySelector(".errorr");
let empty = document.querySelector(".empty");

async function fetchQuestions(subject) {
  loader.classList.remove("d-none");
  const storedQuestions = sessionStorage.getItem("questions");
  if (storedQuestions) {
    loader.classList.add("d-none");
    $("#mainContiner").removeClass("d-none");
    return JSON.parse(storedQuestions);
  }

  try {
    let response = await fetch("../file.json");

    if (!response.ok) {
      loader.classList.add("d-none");
      error.classList.remove("d-none");
      throw new Error("Network response was not ok");
    }

    let data = await response.json();

    if (!data[subject] || data[subject].length === 0) {
      loader.classList.add("d-none");
      empty.classList.remove("d-none");
      return [];
    }

    const questions = data[subject].map((q) => {
      const answers = q.options.map(
        (option, index) => new Answer(option, index === q.answer)
      );
      return new Question(q.question, answers);
    });

    randomizeQ(questions);
    sessionStorage.setItem("questions", JSON.stringify(questions));

    setTimeout(() => {
      loader.classList.add("d-none");
      $("#mainContiner").removeClass("d-none");
      displayQuestions();
    }, 2000);

    return questions;
  } catch (err) {
    console.error("Fetch error:", err);
    loader.classList.add("d-none");
    error.classList.remove("d-none");
  }
}

let questions = [];
let currentIndex = 0;
let timer;
let time;
let score = 0;
let markedQuestions =
  JSON.parse(sessionStorage.getItem("markedQuestions")) || [];
let answers = [];
let choisesSelected =
  JSON.parse(sessionStorage.getItem("choisesSelected")) || [];
let submit = false;
let flagElement;

window.onload = async function () {
  startTimer();
  const currentSubject = JSON.parse(sessionStorage.getItem("currentSubject"));
  if (currentSubject) {
    questions = await fetchQuestions(currentSubject);
    time = sessionStorage.getItem("time");
  }
  loadStoredQuestions();
  loadStoredSelections();
  displayMarkedQuestions();
};

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("submit") === "true") {
    window.location.href = "../home/home.html";
  }
});

function loadStoredSelections() {
  choisesSelected.forEach((selected) => {
    const questionElement = document.querySelector(
      `[data-question="${selected.question}"]`
    );

    if (questionElement) {
      const choiceElements = document.querySelectorAll(".choice");
      choiceElements.forEach((choice) => {
        if (choice.textContent === selected.choice) {
          choice.setAttribute("id", "selected");
        }
      });
    }
  });
}
function loadStoredQuestions() {
  const storedQuestions = JSON.parse(sessionStorage.getItem("questions"));
  if (storedQuestions) {
    questions = storedQuestions;
    document.getElementById("totalQuestions").textContent =
      storedQuestions.length;
    displayQuestions();
    loadStoredSelections();

    const storedAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];
    answers = storedAnswers;
    if (answers.length > 0) {
      currentIndex = answers.length - 1;
    }
  }
}

function displayQuestions() {
  const container = document.getElementById("questionsContainer");
  const choicesContainer = document.getElementById("choices");
  const currentQuestion = questions[currentIndex];

  container.innerHTML = "";
  choicesContainer.innerHTML = "";

  if (currentQuestion) {
    const questionElement = document.createElement("div");
    questionElement.classList.add("question", "fw-lg-bold");
    questionElement.setAttribute("data-question", currentQuestion.question);
    questionElement.textContent = `${currentIndex + 1}. ${
      currentQuestion.question
    }`;

    flagElement = document.createElement("div");
    flagElement.id = "flag";
    flagElement.classList.add("d-flex");
    flagElement.style.cursor = "pointer";
    flagElement.innerHTML = "<i class='fa-solid fa-flag'></i>";

    if (markedQuestions.includes(currentIndex)) {
      flagElement.classList.add("flag");
    } else {
      flagElement.classList.remove("flag");
    }

    container.appendChild(questionElement);
    container.appendChild(flagElement);

    currentQuestion.answers.forEach((answer) => {
      const choice = document.createElement("div");
      choice.classList.add("choice");
      choice.setAttribute("value", answer.isCorrect);
      choice.textContent = answer.option;
      choice.onclick = function () {
        selectAnswer(choice, currentQuestion.question);
      };
      choicesContainer.appendChild(choice);
    });

    document.getElementById("currentQuestionIndex").textContent =
      currentIndex + 1;

    if (flagElement) {
      flagElement.onclick = toggleMarkQuestion;
    }
  }

  loadStoredSelections();
}

function selectAnswer(choice, question) {
  const selectedOption = choice.getAttribute("value") === "true";
  answers[currentIndex] = selectedOption;
  sessionStorage.setItem("answers", JSON.stringify(answers));

  document.querySelectorAll(".choice").forEach((c) => c.removeAttribute("id"));
  choice.setAttribute("id", "selected");

  const selected = {
    question: question,
    choice: choice.textContent,
    isCorrect: selectedOption,
  };

  const existingIndex = choisesSelected.findIndex(
    (item) => item.question === question
  );

  if (existingIndex !== -1) {
    choisesSelected[existingIndex] = selected;
  } else {
    choisesSelected.push(selected);
  }

  sessionStorage.setItem("choisesSelected", JSON.stringify(choisesSelected));
}

function calculateScore() {
  const correctAnswers = questions.map(
    (q) => q.answers.find((answer) => answer.isCorrect).isCorrect
  );
  score = answers.reduce(
    (tot, answer, index) => tot + (answer === correctAnswers[index]),
    0
  );
  showResult(score);
}

function updateButtonStates(totalQuestions) {
  prev.classList.toggle("disabled", currentIndex === 0);
  next.classList.toggle("disabled", currentIndex >= totalQuestions - 1);
}

next.onclick = function () {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    displayQuestions();
    updateButtonStates(questions.length);
  }
};

prev.onclick = function () {
  if (currentIndex > 0) {
    currentIndex--;
    displayQuestions();
    updateButtonStates(questions.length);
  }
};

function startTimer() {
  const timerElement = document.getElementById("time");
  timer = setInterval(() => {
    if (time > 0) {
      time--;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerElement.innerHTML = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      sessionStorage.setItem("time", time);
    } else {
      clearInterval(timer);
      showTimeOutPage();
    }
    if (time < 60) {
      $("#timer").addClass("text-danger");
    }
  }, 1000);
}

function showTimeOutPage() {
  window.location.href = "../timeout/timeout.html";
}

function submitQuiz() {
  submit = true;
  localStorage.setItem("submit", submit);
  clearInterval(timer);
  calculateScore();
}

function showResult() {
  sessionStorage.setItem("score", JSON.stringify(score));
  if (score >= 5) {
    window.location.href = "../pass/pass.html";
  } else {
    window.location.href = "../fail/fail.html";
  }
}

document.getElementById("submit").onclick = submitQuiz;

function displayMarkedQuestions() {
  const markedContainer = document.getElementById("markedQuestionsContainer");
  markedContainer.innerHTML = "";
  markedQuestions.forEach((questionId) => {
    const markedElement = document.createElement("div");
    markedElement.classList.add("marked-question");
    markedElement.setAttribute("data-id", questionId);
    markedElement.innerHTML = `<div class="rounded-2 mark brownColor p-3 d-flex justify-content-between"> <span>Question ${
      questionId + 1
    }</span> <span class="text-danger remove"><i class="fa-solid fa-trash"></i></span> </div>`;
    markedElement.querySelector(".remove").onclick = function (e) {
      e.stopPropagation();
      markedElement.remove();
      flagElement.classList.remove("flag");
      markedQuestions = markedQuestions.filter((id) => id !== questionId);
      sessionStorage.setItem(
        "markedQuestions",
        JSON.stringify(markedQuestions)
      );
    };
    markedElement.onclick = function () {
      currentIndex = questionId;
      displayQuestions();
      updateButtonStates(questions.length);
    };
    markedContainer.appendChild(markedElement);
  });
}

function toggleMarkQuestion() {
  const questionId = currentIndex;
  const markedIndex = markedQuestions.indexOf(questionId);

  if (markedIndex !== -1) {
    markedQuestions.splice(markedIndex, 1);
    document
      .querySelector(`.marked-question[data-id="${questionId}"]`)
      .remove();
    flagElement.classList.remove("flag");
  } else {
    markedQuestions.push(questionId);
    flagElement.classList.add("flag");
  }

  sessionStorage.setItem("markedQuestions", JSON.stringify(markedQuestions));
  displayMarkedQuestions();
}
