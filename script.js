const language = "en-US";
const timePerPhrase = 3;

var phrases = [
	"Welcome. This is a test.", 
	"So, just say the phrases.", 
	"And pronunciate as good as you can."
];

var points = 0;
var newPoints = null;

var outputElement = document.getElementById('output');
var phraseElement = document.getElementById('phrase');
var phraseTimeElement = document.getElementById('phraseTime');
var pointsElement = document.getElementById('points');

var spoken = "";
var currentPhrase;
var phraseIndex = 0;

var nextPhraseDelayTimer = null;
var countDownTimer = null;

// Configure recognizer
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = true;
recognizer.interimResults = false;

var recognizerStarted = false;


// Configure voice speaker 
const synth = window.speechSynthesis;
var utterance = new SpeechSynthesisUtterance();
utterance.lang = language;

var readingAloud = false;


//Audios
var assertSound = new Audio('./sound/assert.mp3');



//On start room
document.getElementById('startRoom').onclick = function(){
	
	recognizer.start();
	recognizerStarted = true;
		
	recognizer.onstart = function(){
		//Handle new phrase every few seconds
		nextPhraseDelayTimer = setInterval(newPhrase, timePerPhrase*1000);
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
	pointsElement.textContent = 0;
	
	phraseIndex = 0;
	
	//Stop speaker
	recognizerStarted = false;
	recognizer.stop();
}

function newPhrase(){
	
	if(newPoints !== null){
		
		utterance.text = "Foucs for more.";
		
		if(newPoints>0){
			
			utterance.text = "You got this!";	
			assertSound.play();
			
			//Increase points
			points = points + newPoints;
			pointsElement.textContent = points;			
		}
		//Read aloud (celebration for points)
		readingAloud=true;
		synth.speak(utterance);
	}
	
	//If room still has phrases to show
	if(phraseIndex < phrases.length){
		
		//Get new phrase
		currentPhrase = phrases[phraseIndex];
		
		outputElement.innerHTML = "";
		phraseElement.textContent = currentPhrase;
		
		clearInterval(nextPhraseDelayTimer);
		
		utterance.onend = function(){
			
			readingAloud=false;
			
			if(recognizerStarted){
				
				//And keep track of phrase's elapsed time
				let phraseTime = timePerPhrase;
				phraseTimeElement.textContent = phraseTime;
				
				countDownTimer = setInterval(() => {
					
					phraseTime--;
					
					if(phraseTime <= 0){
						clearInterval(countDownTimer);
					}
					//Display current phrase time second
					phraseTimeElement.textContent = phraseTime;
				}, 1000);
				
				nextPhraseDelayTimer = setInterval(newPhrase, timePerPhrase*1000);
			}
		}
		phraseIndex
		newPoints = 0;
	}
	else{
		//Room finished
		stopRoom();
	}	
}




//On each speach recognition
recognizer.onresult = function(event) {
	
	if(!readingAloud){
		
		outputElement.innerHTML = "";
		
		spoken = event.results[event.resultIndex][0].transcript;
		
		let spokenWords = clearAndFormatAsWordsArray(spoken);
		
		let = currentPhraseAsWords = clearAndFormatAsWordsArray(currentPhrase);
		
		currentPhraseAsWords.forEach( (word, index) => {
			if(spokenWords[index] !== undefined){
				
				if(spokenWords[index] === word){
					
					outputElement.innerHTML += `<span style="color: green;">${word} </span>`;
					
					//Get new points from spoken phrase result
					newPoints++;
					return;
				}
				else{
					//The word doesn't match
					outputElement.innerHTML += `<span style="color: red;">${spokenWords[index]} </span>`;
				}
			}
		});
	}
}


function clearAndFormatAsWordsArray(text){
	return text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);
}