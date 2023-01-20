// Select Elements 
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions() {

  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {

    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length

      // Create Bullets + Set Question Count
      createBullets(qCount);

      // Add Questions Data
      questionData(questionsObject[currentIndex], qCount)

      // Start CountDown
      countdown(29, qCount);

      // Click on Submit
      submitBtn.onclick = () => {

        // Get the right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check the Answer
        checkAnswer(theRightAnswer, qCount)

        // Remove Previous Question
        quizArea.innerHTML = '';
        answersArea.innerHTML = '';

        // Add Question Data
        questionData(questionsObject[currentIndex], qCount)



        // Handle Bullets Class
        handleBullets();

        // Start Countdown
        clearInterval(countdownInterval)
        countdown(29, qCount)

        // Show Results
        showResults(qCount);
      }
    }
  }

  myRequest.open("GET", "./html_questions.json", true);
  myRequest.send()
}
getQuestions();


function createBullets(num) {

  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span")
    // Check if it is first span
    if (i === 0) {
      theBullet.className = "on"
    }
    // Append Bullets to main Bullet container
    bulletsSpans.appendChild(theBullet)
  }

}

function questionData(obj, count) {
  if (currentIndex < count) {

    // Create Question tag [h2]
    let qTitle = document.createElement('h2')

    // 
    let qText = document.createTextNode(obj.title);
    // Append Text to "h2"
    qTitle.appendChild(qText)
    // Append Question
    quizArea.appendChild(qTitle)

    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName("question")
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {

  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);

  arrayOfSpans.forEach((span, index) => {

    if (currentIndex === index) {
      span.className = "on"
    }
  });

}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, You answered ${rightAnswers} Correctly from ${count}`
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All answers are right and that's Amazing!!`
    } else {
      theResults = `<span class="bad">Sorry</span>, You failed ):, You answered ${rightAnswers} Correctly from ${count}`
    }

    results.innerHTML = theResults;
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";

  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {

      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click()
      }

    }, 1000);
  }
}