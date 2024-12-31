const language = "en-US";

var phrases = [
	"This is a test.",
	"So, just say the phrases.",
	"And pronunciate as good as you can."
];

var points = 0;

var outputElement = document.getElementById('output');
var phraseElement = document.getElementById('phrase');
var phraseTimeElement = document.getElementById('phraseTime');
var pointsElement = document.getElementById('points');
var remainElement = document.getElementById('remain');
var finalScoreElement = document.getElementById('finalScore');

var phraseResultsElement = document.getElementById('phraseResults');
var phraseResultElement;

var spoken = "";
var currentPhrase;
var phraseIndex = 0;
var remain;
var processedWordIndexs = [];
var phraseTime;

var nextPhraseDelayTimer = null;
var countDownTimer = null;

// Configure recognizer
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = true;
recognizer.interimResults = true;

var recognizerStarted = false;


// Configure voice speaker 
const synth = window.speechSynthesis;
var utterance = new SpeechSynthesisUtterance();
utterance.lang = language;



//Audios
var assertSound = new Audio('./sound/assert.mp3');
var celebrateSound = new Audio('./sound/celebrate.mp3');


//On start room
document.getElementById('startRoom').onclick = function(){
	
	recognizer.start();
	recognizerStarted = true;
	
	points = 0;
	pointsElement.textContent = points;
	finalScoreElement.textContent = points;
	
	remain = phrases.length;
	remainElement.textContent = remain;
	
	phraseResultsElement.innerHTML = "";
		
	recognizer.onstart = function(){
		newPhrase();
	}
	
	recognizer.onerror = function(){
		stopRoom();
	}
}

function stopRoom(){
	
	clearInterval(nextPhraseDelayTimer);
	clearInterval(countDownTimer);
	
	//Clear display
	phraseElement.textContent = "";
	phraseTimeElement.textContent = "";
	outputElement.innerHTML = "";
	
	remain = 0;
	remainElement.textContent = remain;
	
	phraseIndex = 0;
	
	//Stop speaker
	recognizerStarted = false;
	recognizer.stop();
	
	//Display results
	finalScoreElement.textContent = points;
	
	if(points > 0){
		celebrateSound.play();
	}
}


function newPhrase(){
	
	//If room still has phrases to show
	if(phraseIndex < phrases.length){
		
		//Get new phrase
		currentPhrase = phrases[phraseIndex];
		processedWordIndexs = [];
		
		outputElement.innerHTML = "";
		phraseElement.textContent = currentPhrase;
		
			
		clearInterval(nextPhraseDelayTimer);
		
		if(recognizerStarted){
			
			//And keep track of phrase's elapsed time
			phraseTime = Math.floor(clearAndFormatAsWordsArray(currentPhrase).length);
			phraseTimeElement.textContent = phraseTime;
			
			countDownTimer = setInterval(() => {
				
				phraseTime--;
				
				if(phraseTime <= 0){
					clearInterval(countDownTimer);
					
					//Update remaining phrases number
					remain--;
					remainElement.textContent = remain;
					
					if(phraseResultElement.innerText.length === 0){
						phraseResultElement.innerHTML = `<span style="color: black;">${phrases[index-1]} </span>`;
					}
					phraseResultsElement.appendChild(phraseResultElement);
					phraseResultElement = document.createElement('li');
				}
				//Display current phrase time second
				phraseTimeElement.textContent = phraseTime;
			}, 1000);
		}
		
		nextPhraseDelayTimer = setInterval(newPhrase, phraseTime*1000);
		
		phraseIndex++;
	}
	else{
		//Room finished
		stopRoom();
	}	
}

//On each speach recognition
recognizer.onresult = function(event) {
		
	outputElement.innerHTML = "";
	
	spoken = event.results[event.resultIndex][0].transcript;
	
	let spokenWords = clearAndFormatAsWordsArray(spoken);
	
	let = currentPhraseAsWords = clearAndFormatAsWordsArray(currentPhrase);
	
	currentPhraseAsWords.forEach( (word, index) => {
		if(spokenWords[index] !== undefined){
			
			if(spokenWords[index] === word){
				
				let spokenPhraseElementReference = `<span style="color: green;">${word} </span>`;
				
				outputElement.innerHTML += spokenPhraseElementReference;
				phraseResultElement.innerHTML += spokenPhraseElementReference;
				
				if(!processedWordIndexs.includes(index)){
					
					//Increase points
					points++;
					pointsElement.textContent = points;
					assertSound.play();
					
					processedWordIndexs.push(index);
				}
				return;
			}
			else{
				//The word doesn't match
				outputElement.innerHTML += `<span style="color: red;">${spokenWords[index]} </span>`;
			}
		}
	});
}


function clearAndFormatAsWordsArray(text){
	return text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);
}