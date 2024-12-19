const language = "en-US";

// Configure recognizer
let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
let SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = true;
recognizer.interimResults = true;

// Configure voice speaker 
const synth = window.speechSynthesis;

let outputElement = document.getElementById('output');
var inputText = document.getElementById('textReference').value;
var referenceWords = cleanAndFormatWordsAsArray(inputText);



function cleanAndFormatWordsAsArray(wordsAsString){
	return words.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).toLowerCase();
}

function stopSpeaker(){
	recognizer.stop();
}


//Read aloud
document.getElementById('readAloudButton').onclick = function(event){
	
	let utterance = new SpeechSynthesisUtterance(inputText.trim());
	utterance.lang = language;
	synth.speak(utterance);
}


//Start speaker
document.getElementById('startSpeakerButton').onclick = function(event) {
	stopSpeaker();
	recognizer.start();
}

//Stop speaker
document.getElementById('stopSpeakerButton').addEventListener('click', stopSpeaker);


//On each speak recognition time
recognizer.onresult = function(event) {
	
	outputElement.innerHTML = "";
    
	spoken = event.results[event.resultIndex][0].transcript;
	
	if( spoken !== undefined ){
		
		let spokenWords = cleanAndFormatWordsAsArray(spoken);
		
		referenceWords.forEach( (word, index) => {
		
			if(spokenWords[index] === word){
				outputElement.innerHTML += `<span style="color: green;">${word}</span>`;
				return;
			}
		});
	}
	//The word doesn't match or exist
	outputElement.innerHTML += `<span style="color: red;">${word}</span>`;
}

recognizer.onerror = function(event) {
    console.error('Error ocurred: ' + event.error);
}