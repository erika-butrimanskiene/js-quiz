// Variables
const startBtn = document.querySelector('#start-btn');
const nextBtn = document.querySelector('#next-btn');

const quizQuestionElement = document.querySelector('#quiz__question');
const questionElement = document.querySelector('#question');
const answersBtnsElement = document.querySelector('#answers-btns');
const resultElement = document.querySelector('#result');

let questions = [];
let index;
let score = 0;

// Fetching data to questons array
fetch('questions.json')
  .then((response) => response.json())
  .then((data) => questions.push(...data));

// Functions
function startGame() {
  let timeContainerToRemove = document.querySelector('.time-container');
  if (timeContainerToRemove != null) {
    timeContainerToRemove.remove();
  }
  getQuizTimer();
  index = 0;
  setNextQuestion();
}

function getQuizTimer() {
  const quiz = document.querySelector('.quiz');
  const timeContainer = document.createElement('div');
  timeContainer.classList.add('time-container');
  quiz.appendChild(timeContainer);

  const time = document.createElement('p');
  time.classList.add('time');
  time.innerText = '0';
  timeContainer.appendChild(time);
  score = 0;
  startBtn.classList.add('hide');
  quizQuestionElement.classList.remove('hide');
  let startTime = 0;

  setInterval(() => {
    if (questions.length > index + 1) {
      ++startTime;
    }

    let minutes = Math.floor(startTime / 60);
    let seconds = startTime - minutes * 60;
    if (minutes < 10) {
      displayTime(time, minutes, seconds);
    } else {
      displayTime(time, minutes, seconds);
    }
  }, 1000);
}

function displayTime(time, min, sec) {
  if (sec < 10) {
    time.innerText = `${min}:0${sec}`;
  } else if (sec < 60) {
    time.innerText = `${min}:${sec}`;
  }
}

function setNextQuestion() {
  resetState();
  showQuestion(questions[index]);
}

function selectAnswer(e) {
  let correct = e.target.dataset.correct;
  let answersBtns = document.querySelectorAll('.btn');

  if (correct) {
    e.target.classList.add('correct');
    let text = e.target.innerText;
    e.target.innerHTML += ` <i class='fas fa-check-circle'></i>`;
    score++;
  } else {
    e.target.classList.add('wrong');
    let text = e.target.innerText;
    e.target.innerHTML += ` <i class="fas fa-times-circle"></i>`;
  }

  answersBtns.forEach((btn) => {
    if (btn.id != 'next-btn' && btn.id != 'start-btn') {
      btn.disabled = true;
    }
  });

  if (questions.length > index + 1) {
    nextBtn.classList.remove('hide');
  } else {
    startBtn.innerText = 'Restart';
    startBtn.classList.remove('hide');

    resultElement.classList.remove('hide');
    resultElement.innerText = `Correct answers: ${score} from ${questions.length} questions`;
  }
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.classList.add('btn');
    button.innerText = answer.text;
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }

    button.addEventListener('click', selectAnswer);
    answersBtnsElement.appendChild(button);
  });
}

function resetState() {
  nextBtn.classList.add('hide');
  // score = 0;
  resultElement.innerText = '';

  while (answersBtnsElement.firstChild) {
    answersBtnsElement.removeChild(answersBtnsElement.firstChild);
  }
}

function showNextQuestion() {
  index++;
  setNextQuestion();
}

// Events
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', showNextQuestion);
