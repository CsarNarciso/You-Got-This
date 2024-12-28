const language = "en-US";

var outputElement = document.getElementById('output');

var phrases = [
	"Hi, how are you?", 
	"Welwome. This is a test.", 
	"So, just say the phrase.", 
	"And speak as much as you can."
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



var phraseIndex = 0;
var roomPhrasesTimer = null;

//On start room
document.getElementById('startRoom').click(function(){
	
	//Start speaker
	recognizer.start();
	
	//Handle new phrase every few seconds
	roomPhrasesTimer = setTimeout(newPhrase, 5000);
});

function stopRoom(){
	//Stop speaker
	recognizer.stop();
	
	//Stop room phrases timer
	clearInterval(roomPhrasesTimer);
}

function newPhrase(){
	
	//If room still has phrases to show
	if(phraseIndex < phrases.length){
		
		var phrase = phrases[phraseIndex];
		
		//Show new phrase
		outputElement.innerHTML = "";
		document.getElementById('phrase').textContent = phrase;
	
		//Read it aloud
		let utterance = new SpeechSynthesisUtterance(phrase);
		utterance.lang = language;
		synth.speak(utterance);
		
		phraseIndex++;
	}
	else{
		//Room finished
		stopRoom;
	}	
}




//On each speach recognition
recognizer.onresult = function(event) {
	
	outputElement.innerHTML = "";
    
	spoken = event.results[event.resultIndex][0].transcript;
		
	let spokenWords = clearAndFormatWordsAsArray(spoken);
	
	referenceWords.forEach( (word, index) => {
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


function clearAndFormatWordsAsArray(wordsAsString){
	return wordsAsString.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);
}