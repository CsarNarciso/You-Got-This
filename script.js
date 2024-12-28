const language = "en-US";

var outputElement = document.getElementById('output');
var phraseElement = document.getElementById('phrase');

var phrases = [
	"Welcome. This is a test.", 
	"So, just say the phrases.", 
	"And pronunciate as good as you can."
];

// Configure recognizer
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = true;
recognizer.interimResults = true;

// Configure voice speaker 
const synth = window.speechSynthesis;


var currentPhrase;
var phraseIndex = 0;
var roomPhrasesTimer = null;

//On start room
document.getElementById('startRoom').onclick = function(){
	
	//Start speaker
	recognizer.start();

	//Handle new phrase every few seconds
	roomPhrasesTimer = setInterval(newPhrase, 5000);
}

function stopRoom(){
	
	//Clear display
	phraseElement.textContent = "";
	outputElement.innerHTML = "";
	
	phraseIndex = 0;
	
	//Stop speaker
	recognizer.stop();

	//Stop room phrases timer
	clearInterval(roomPhrasesTimer);
}

function newPhrase(){
	
	//If room still has phrases to show
	if(phraseIndex < phrases.length){
		
		currentPhrase = phrases[phraseIndex];
		
		//Show new phrase
		outputElement.innerHTML = "";
		phraseElement.textContent = currentPhrase;
	
		//Read it aloud
		let utterance = new SpeechSynthesisUtterance(currentPhrase);
		utterance.lang = language;
		synth.speak(utterance);
		
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
				outputElement.innerHTML += `<span style="color: green;">${word} </span>`;
				return;
			}
		}
		//The word doesn't match or exist
		outputElement.innerHTML += `<span style="color: red;">${word} </span>`;
	});
}


function clearAndFormatAsWordsArray(text){
	return text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);
}