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
	return words.trim.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).toLowerCase();
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
document.getElementById('stopSpeakerButton').onclick(stopSpeaker);


//On each speak recognition time
recognizer.onresult = function(event) {
	
	outputElement.innerHTML = "";
    
	spoken = event.results[event.index][0].transcript;
	
	if( spoken !=== undefined ){
		
		spokenWords = cleanAndFormatWordsAsArray(spoken);
		
		referenceWords.forEach( (word, index) => {
		
			if(spokenWords[index] === word){
				outputElement.innerHTML = `<span style="color: green;">${word}</span>`
			}
			else{
				outputElement.innerHTML = `<span style="color: red;">${word}</span>`
			}
		});
	}
	else {
		//the word index doesn't exist
		outputElement.innerHTML = `<span style="color: red;">${word}</span>`
	}
}

recognizer.onnomatch = function(event) {
    console.log('----Recognizer couldnt detect what you speak---');
}

recognizer.onspeechend = function(event) {
    console.log('-----Recognizer couldnt detect what you said...----');
}

recognizer.onerror = function(event) {
    console.error('Error ocurred: ' + event.error);
}