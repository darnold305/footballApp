// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
// Code goes here


// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html
// Code goes here


var teamList = [];
var currentPlayerArray = []

var questionTypes = [
   {
      questionId: 0,
      questionContent: "What number does this player have?",
      questionVariable: function(whichPlayer){
        return currentPlayerArray[whichPlayer].Name},
      answerType: "Number",
      correctAnswerContent: "That's right!",
      incorrectAnswerContent: "Not quite.",
      generateAnswerContent: function(player){
        var num = currentPlayerArray[player].Number;
        var pos = currentPlayerArray[player].Position;
        var str = String(num + ", " + pos);
        return str},
      correctAnswer: function(whichPlayer){
        return currentPlayerArray[whichPlayer].Number},
    },
    {
      questionId: 1,
      questionContent: "Which player wears this number?",
      questionVariable: function(whichPlayer){
         return currentPlayerArray[whichPlayer].Number},
      answerType: "Name",
      correctAnswerContent: "That's right!",
      incorrectAnswerContent: "Not quite.",
      correctAnswer: function(whichPlayer){
        return currentPlayerArray[whichPlayer].Name},
      generateAnswerContent: function(player){
        var name = currentPlayerArray[player].Name;
        var pos = currentPlayerArray[player].Position;
        var str = String(name + ", " + pos);
        return str},
    },
]


var createTeamList = function(){
    for (i=0; i<teamArray.length; i++) {
        var teamName = teamArray[i].FullName;
        var teamColorObj = teamColorData.filter(function( obj ) {
        return obj.name == teamName
        });
        var teamLogo = teamColorObj[0].svg
        teamList.push(
            {Key: teamName, Logo: teamLogo})
    }
    teamList.sort();
    return teamList;
};

var init = function(){
  teamList = createTeamList();
  teamsUl = document.querySelector('#teamChoices');
  for (i=0; i<teamList.length; i++) {
    teamLi = document.createElement('li')
    teamLi.classList = "teamChoice"
    teamLi.id = i
    teamLi.innerHTML = teamList[i].Logo;
    teamsUl.appendChild(teamLi);
  }
};

var flashcard = {
  correctAnswer: "",
  yourScore:0,
  gameCounter: 0,
  questionType: 0,
  footballPlayers: [],
  
  isGameComplete: function(){
    if (flashcard.gameCounter === currentPlayerArray.length) {
      var answersDiv = document.querySelector('ul');
      answersDiv.innerHTML = '';
      answersDiv.textContent = 'You got them all right! GAME OVER!';
    }
    else {
      handlers.displayQuestion();
    }
  },
  
  
  checkAnswer: function(answerChoice) {
    if (answerChoice === "correctAnswer") {
      flashcard.yourScore++
      yourScoreText.textContent = ("Your Score: " + flashcard.yourScore + " / " + currentPlayerArray.length);
      answerFeedback.textContent = "Great Job!";
      //view.isGameComplete(); 
    }
    else {
      answerFeedback.textContent = "Wrong. Study harder!"
    }
    view.displayRightAnswer();
  },
};

var handlers = {
  displayQuestion: function() {
    view.displayQuestion(flashcard.questionType);
   // view.displayAnswerChoices(flashcard.questionType);
  }
};

var view = {
  chooseTeam: function(teamChoice) {
    $('#chooseTeam').hide();
    $('#gameTeam').show();
    $('#whichQuestionType').show();
    var teamKey = teamArray[teamChoice].Key;
    playerArray.forEach( function(player){
      if (player.Team === teamKey) {
        currentPlayerArray.push(player);
      }
    });
    var teamObj = teamArray.filter(function( obj ) {
        return obj.Key == teamKey;
    });
    $("#teamTitle").text(teamObj[0].FullName);
    $("#teamTitle").show();
  },
  
  displayQuestion: function(questionType) {
    $("#answerFeedback").hide();
    flashcard.gameCounter++;
    var whichPlayer = (Math.floor(Math.random() * currentPlayerArray.length));  
    
    while (currentPlayerArray[whichPlayer].completed) {
      whichPlayer = (Math.floor(Math.random() * currentPlayerArray.length));  
    }
    currentPlayerArray[whichPlayer].completed = true;
    
    var questionP = document.querySelector("#questionTitle");
    questionP.innerHTML = '';
    questionText = '';
    
    questionText = questionTypes[questionType].questionContent;
    questionVariable = questionTypes[questionType].questionVariable(whichPlayer);
    flashcard.correctAnswer = questionTypes[questionType].correctAnswer(whichPlayer);
    this.displayPlayerPhoto(whichPlayer);
    questionP.textContent = (questionText + "  " + questionVariable);
    this.displayAnswerChoices(whichPlayer, flashcard.questionType);
    },
  
  displayAnswerChoices: function(whichPlayer, questionType) {
    var answersUl = document.getElementById('answerChoices');
    answersUl.innerHTML = '';
    var allAnswerChoices = [];
    allAnswerChoices = getRandomAnswerChoices(whichPlayer, questionType)

    for (i=0; i<allAnswerChoices.length; i++) {
        var answerLi = document.createElement('li');
        answerLi.class = "answerLi";
        var answerButton = document.createElement('button');
        var answerChoice = questionTypes[questionType].generateAnswerContent(allAnswerChoices[i]);
        answerLi.id = i;
        answerButton.class = "answerChoice";
        answerButton.textContent = answerChoice
        if (allAnswerChoices[i] === whichPlayer){
          answerButton.id = "correctAnswer"
        }
        else {
            answerButton.classList = "incorrectAnswer"
        }
        answersUl.appendChild(answerLi);
        answerLi.appendChild(answerButton);
    }
    },
  
  displayPlayerPhoto: function(whichPlayer) {
    $('#playerPhoto').empty();
    var photoUrl = currentPlayerArray[whichPlayer].PhotoUrl;
    if (photoUrl === "http://static.fantasydata.com/headshots/nfl/low-res/0.png") {
      return}
    var photoTag = document.createElement('img');
    photoTag.src = photoUrl;
    $('#playerPhoto').append(photoTag);
  },
    
  displayRightAnswer: function() {
    $(".incorrectAnswer").css("color", "gray");
    $("#correctAnswer").css("background-color","yellow");
    $("#keepPlaying").show();
    $("#answerFeedback").show();
  },
    
  clearAnswerChoices: function() {
    var answersP = document.querySelector("#questionTitle");
    answersP.innerHTML = '';
    var answersUl = document.querySelector("#answerChoices");
    answersUl.innerHTML = '';
  
    if (flashcard.isGameComplete(flashcard.gameCounter)) {
    }
  },
  
  setupEventListeners: function() {
    $('#keepPlayingYes').on('click', function(event){
        handlers.displayQuestion();
    });
      
    $('#keepPlayingNo').on('click', function(event){
        $('#gameDiv').empty()
        $('#gameDiv').text("GAME OVER")
    });
      
    var answerChoice = 'wrongAnswer';
    $('#answerChoices').on('click', function(event){
      answerChoice = event.target.id;
      flashcard.checkAnswer(answerChoice);
    });
    
    var questionTypeNameButton = document.getElementById("questionTypeNameButton");
    questionTypeNameButton.addEventListener('click', function(event) {
      var whichQuestionType = document.getElementById("whichQuestionType");
      whichQuestionType.innerHTML = "";
      flashcard.questionType = 0;
      handlers.displayQuestion()
    });
    
    var questionTypeNumberButton = document.getElementById("questionTypeNumberButton");
    questionTypeNumberButton.addEventListener('click', function(event) {
      var whichQuestionType = document.getElementById("whichQuestionType");
      whichQuestionType.innerHTML = "";
      flashcard.questionType = 1;
      handlers.displayQuestion()
    });
  
    var newUl = document.querySelector('#teamChoices');
    newUl.addEventListener('click', function(event) {
      var teamChoice = '';
      teamChoice = parseInt(event.target.closest('li').id)
      if (Number.isInteger(teamChoice)) {
        view.chooseTeam(teamChoice);
      }
    });
}

  
};

function getRandomAnswerChoices(whichPlayer, questionType) {
    var allAnswerChoices = [];
    for (i=0; i<3; i++) {
      var index = Math.floor(Math.random() * currentPlayerArray.length);
      if (index === whichPlayer) {
        i--
      }
      else {
        allAnswerChoices.push(index);
      }
    }
    allAnswerChoices.push(whichPlayer);
    allAnswerChoices = shuffle(allAnswerChoices);
    return allAnswerChoices
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};


view.setupEventListeners();
var yourScoreText = document.getElementById("yourScore");
yourScoreText.textContent = ("Your Score: " + flashcard.yourScore + " / " + currentPlayerArray.length);
init();
$("#keepPlaying").hide();
$("#teamTile").hide();