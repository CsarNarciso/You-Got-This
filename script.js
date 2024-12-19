var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// Configure recognizer
var recognizer = new SpeechRecognition();
recognizer.lang = 'en-US';
recognizer.continuous = true;
recognizer.interimResults = true;

var outputElement = document.getElementById('output');
var referenceWords = cleanAndFormatWordsAsArray(document.getElementById('textReference').value);

function cleanAndFormatWordsAsArray(wordsAsString){
	return words.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).toLowerCase();
}

function stopSpeaker(){
	recognizer.stop();
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
		
		spokenWords = cleanAndFormatWordsAsArray(spoken);
		
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