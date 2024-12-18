var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognizer = new SpeechRecognition();

// Configure recognizer
recognizer.continuous = true;
recognizer.lang = 'en-US';
//recognizer.interimResults = true;
recognizer.maxAlternatives = 1;

var spokenElement = document.getElementById('spoken');
var spoken = "";
var result = 0;

//Start speaking button
document.getElementById('speakButton').onclick = function(event) {
    recognizer.start();
    console.log('---Recognizer ready!---');
    spokenElement.innerText = "";
}

//Stop button
document.getElementById('stopButton').onclick = function(event) {
    recognizer.stop();
    console.log('---Recognizer stopped---');
    spoken = "";
    result = 0;
}

//Configure recognizer events
recognizer.onresult = function(event) {
    spoken = spoken + ", " + event.results[result][0].transcript;
    console.log(spoken);
    spokenElement.innerText = spoken; 
    result = result + 1;
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