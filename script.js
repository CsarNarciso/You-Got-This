const language = "en-US";

// Configure recognizer
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = true;
recognizer.interimResults = true;

// Configure voice speaker 
const synth = window.speechSynthesis;

var outputElement = document.getElementById('output');
var inputText = "";
var referenceWords = [];



function cleanAndFormatWordsAsArray(wordsAsString){
	return wordsAsString.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split(/\s+/);
}

function stopSpeaker(){
	inputText = "";
	referenceWords = [];
	outputElement.innerHTML = "";
	recognizer.stop();
}


//Read aloud
document.getElementById('readAloudButton').onclick = function(){
	
	inputText = document.getElementById('textReference').value;
	
	let utterance = new SpeechSynthesisUtterance(inputText.trim());
	utterance.lang = language;
	synth.speak(utterance);
}


//Start speaker
document.getElementById('startSpeakerButton').onclick = function() {
	stopSpeaker();
	
	inputText = document.getElementById('textReference').value;
	referenceWords = cleanAndFormatWordsAsArray(inputText);
	
	recognizer.start();
}

//Stop speaker
document.getElementById('stopSpeakerButton').addEventListener('click', stopSpeaker);


//On each speak recognition time
recognizer.onresult = function(event) {
	
	outputElement.innerHTML = "";
    
	spoken = event.results[event.resultIndex][0].transcript;
		
	let spokenWords = cleanAndFormatWordsAsArray(spoken);
	
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

recognizer.onerror = function(event) {
    console.error('Error ocurred: ' + event.error);
}