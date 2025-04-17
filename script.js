const language = "en-US";

var allPhrases = [
	"Dream big", "Stay strong", "Keep moving forward", "Never give up", "Love conquers all", "Believe in yourself", "Make it happen", "Follow your heart", "Take the leap", "Choose happiness", "Rise above fear", "Stay the course", "Live with purpose", "Trust the process", "Be the light", "Embrace the journey", "Keep hope alive", "Change is good", "Chase your dreams", "Let it go", "You are enough", "Be kind always", "Learn and grow", "Stay the path", "Just keep going", "Do it afraid", "Create your future", "Own your story", "Stay true always", "Breathe and smile", "Give more love", "Fear less live more", "Peace begins within", "You’ve got this", "Stay humble hustle hard", "Every day counts", "Focus on now", "Start with gratitude", "Lead with love", "Think positive thoughts", "Progress over perfection", "Go beyond limits", "Be here now", "One step closer", "Count your blessings", "Work with passion", "Speak your truth", "Light the way", "Do good daily", "Enjoy the moment", "Push past fear", "You are magic", "Act with courage", "Be a warrior", "Stay curious always", "Be wildly grateful", "Practice makes progress", "Trust your intuition", "Laugh out loud", "Rest and reset", "Shine your light", "Never stop learning", "Keep showing up", "Let love lead", "Be the change", "Live your truth", "Love without limits", "Begin with love", "Find your fire", "Inspire with action", "Stay soft strong", "Keep your faith", "Turn pain into power", "Grace over drama", "Grow through it", "Kindness is strength", "Let joy in", "Always choose love", "Find peace inside", "Be beautifully brave", "Stay beautifully flawed", "Hope is real", "Your voice matters", "Celebrate small wins", "You matter always", "Brave not perfect", "Love fiercely always", "Seek the sunshine", "Try again tomorrow", "Feel it all", "Stay grounded always", "Let your soul shine", "Small steps matter", "Keep your head high", "Your heart knows", "Let yourself bloom", "Patience brings peace", "Break your limits", "Be your peace"
];

var phrases = [];



var points = 0;

var outputElement = document.getElementById('output');
var phraseElement = document.getElementById('phrase');
var phraseTimeElement = document.getElementById('phraseTime');
var pointsElement = document.getElementById('points');
var remainElement = document.getElementById('remain');
var finalScoreElement = document.getElementById('finalScore');

var phraseResultsElement = document.getElementById('phraseResults').querySelector('tbody');
var currentPhraseResultElement;

var spoken;
var currentPhrase;
var currentPhraseAsWords;
var cleanAndFormatCurrentPhraseAsWords;
var phraseIndex = 0;
var phraseCompleted = true;
var remain;
var processedWordIndexs = [];
var phraseTime;
var checkingResults = false;

var nextPhraseDelayTimer = null;
var countDownTimer = null;

// Configure recognizer
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognizer = new SpeechRecognition();
recognizer.lang = language;
recognizer.continuous = (isMobile()) ? false : true; //no continous if mobile to avoid mobile browser auto stop micrhopone error


recognizer.interimResults = true;

var recognizerStarted = false;


// Configure voice speaker 
const synth = window.speechSynthesis;
var utterance = new SpeechSynthesisUtterance();
utterance.lang = language;



//Audios
var audioBasePath = './sound/' + (isMobile() ? 'mobile/' : '');
var startRoomSound = new Audio(audioBasePath + 'startRoom.mp3');
var assertSound = new Audio(audioBasePath + 'assert.mp3');
var celebrateSound = new Audio(audioBasePath + 'victory.mp3');
var defeatSound = new Audio(audioBasePath + 'defeat.mp3');

//On start room
document.getElementById('startRoom').onclick = function(){
	
	recognizer.start();
		
	recognizer.onstart = function(){
		
		//Only in first time start (no restarts)
		if(!recognizerStarted){
			
			recognizerStarted = true;
			
			//Get random phrases for current room
			for(let i = 0; i < 10; i++){
				var randomPhrase = allPhrases[Math.floor(Math.random() * allPhrases.length)];
				phrases.push(randomPhrase);
			}
			
			//Display room elements
			document.getElementById('roomContainer').style.display = 'block';
			
			points = 0;
			pointsElement.textContent = points;
			finalScoreElement.textContent = points;
			
			remain = phrases.length;
			remainElement.textContent = remain;
			
			//Hide results elements
			document.getElementById('resultsContainer').style.display = 'none';
			phraseResultsElement.innerHTML = "";
			
			//Hide first screen elements
			document.getElementById('firstScreenContainer').style.display = 'none';
				
			//Play start room sound effect
			startRoomSound.play();
			
			newPhrase();
		}
	}

	recognizer.onerror = function(){
				
		//Hide first screen elements in case it fails before start room
		if(!recognizerStarted){		
			document.getElementById('firstScreenContainer').style.display = 'none';
		}
		stopRoom();
	}
	
	recognizer.onend = function(){
		//Try to re-star recognizer only if it was already started
		if(recognizerStarted){
			recognizer.start();
		}
	}
}

function stopRoom(){
	
	//Re load sounds
	startRoomSound.load();
	assertSound.load();
	celebrateSound.load();
	defeatSound.load();
	
	
	clearInterval(nextPhraseDelayTimer);
	clearInterval(countDownTimer);
	
	//Clear display
	phraseElement.textContent = "";
	phraseTimeElement.textContent = "";
	outputElement.innerHTML = "";
	
	remain = 0;
	remainElement.textContent = remain;
	
	phraseIndex = 0;
	
	
	//Hide room elements
	document.getElementById('roomContainer').style.display = 'none';
	
	
	//Stop speaker
	recognizerStarted = false;
	recognizer.stop();
	
	//Display results
	document.getElementById('resultsContainer').style.display = 'block';
	
	finalScoreElement.textContent = points;
	
	if(points > 0){
		celebrateSound.play();
	}
	else{
		defeatSound.play();
	}
}

function newPhrase(){
	
	//Get new phrase
	currentPhrase = phrases[phraseIndex];
	currentPhraseAsWords = currentPhrase.trim().split(/\s+/);
	cleanAndFormatCurrentPhraseAsWords = clearAndFormatAsWordsArray(currentPhrase);
	processedWordIndexs = [];

	outputElement.innerHTML = "";
	phraseElement.textContent = currentPhrase;

	clearInterval(nextPhraseDelayTimer);

	if(recognizerStarted){
		
		//And keep track of phrase's elapsed time
		phraseTime = Math.floor(clearAndFormatAsWordsArray(currentPhrase).length) + 1;
		phraseTimeElement.textContent = phraseTime;
		
		let row = document.createElement('tr');
		
		let expectedPhaseElement = document.createElement('td');
		expectedPhaseElement.textContent = currentPhrase;
		
		let phraseResultElement = document.createElement('td');
		phraseResultElement.innerHTML = `<span style="color: black;">Waiting...</span>`;
		currentPhraseResultElement = phraseResultElement;
		
		//Attach read aloud icon to table's expected phrase
		let readAloudIcon = document.createElement('span');
		readAloudIcon.innerHTML = "🔊";
		readAloudIcon.style.cursor = "pointer";
		
		let currentPhraseToRead = phrases[phraseIndex];
		readAloudIcon.addEventListener('click', () => {
			
			//Read phrase aloud
			utterance.text = currentPhraseToRead;
			synth.speak(utterance);
		});
		expectedPhaseElement.appendChild(readAloudIcon);
		
		row.appendChild(expectedPhaseElement);
		row.appendChild(phraseResultElement);
		phraseResultsElement.appendChild(row);
		
		countDownTimer = setInterval(() => {
			
			phraseTime--;
			
			if(phraseTime <= 0){
				
				clearInterval(nextPhraseDelayTimer);
				clearInterval(countDownTimer);
				
				if(phraseResultElement.innerHTML === '<span style="color: black;">Waiting...</span>'){
					phraseResultElement.innerHTML = `<span style="color: black;">${currentPhrase}</span>`;
				}
				
				//Re load assert effect sound
				assertSound.load();
				
				//Pass to next phrase
				skipToNextPhrase();
			}
			//Display current phrase time second
			phraseTimeElement.textContent = phraseTime;
		}, 1000);
	}
	nextPhraseDelayTimer = setInterval(newPhrase, phraseTime*1000);
}



//On each speach recognition
recognizer.onresult = function(event) {
		
	if(!checkingResults){
		
		outputElement.innerHTML = "";
		currentPhraseResultElement.innerHTML = "";
		
		phraseCompleted = true; 
		
		spoken = event.results[event.resultIndex][0].transcript;
		let spokenWords = clearAndFormatAsWordsArray(spoken);
		
		let htmlResultReference = generateSpokenHTMLReference(cleanAndFormatCurrentPhraseAsWords, spokenWords);
		outputElement.innerHTML = htmlResultReference;
		currentPhraseResultElement.innerHTML = htmlResultReference;
		
		//Verify if phrase has been already spoken
		if(phraseCompleted){
			//First, wait a seconds to process the last results
			waitToCheckResultsBeforeNextPhrase();
		}
	}
}


function skipToNextPhrase(){
	
	phraseIndex++;
	
	//If room still has phrases to show
	if(phraseIndex < phrases.length){
		
		//Update remaining phrases number
		remain--;
		remainElement.textContent = remain;
		
		newPhrase();
	}else{
		//Room finished
		stopRoom();
	}
}

function waitToCheckResultsBeforeNextPhrase(){
	
	clearInterval(nextPhraseDelayTimer);
	clearInterval(countDownTimer);
	
	checkingResults = true;
	let time = 0;
	let timerBeforeSkipToNextPhrase = setInterval(() => {
			
		time++;	
		if(time > 1){
			
			clearInterval(timerBeforeSkipToNextPhrase);
			checkingResults = false;
			skipToNextPhrase();
		}
	}, 1000);
}

function generateSpokenHTMLReference(expectedPhrase, spoken){
	
	let htmlResult = "";
	let newWord;
	let color;
	
	expectedPhrase.forEach( (word, index) => {
		if(spoken[index] !== undefined){
			
			if(spoken[index] === word){
				//The word matchs
				newWord = currentPhraseAsWords[index];
				color = "green";
				
				//If resutl is not repeated
				if(!processedWordIndexs.includes(index)){
					
					//Increase points
					points++;
					pointsElement.textContent = points;
					
					//Play sound effect (no for mobile because of high delay)
					if(!isMobile()){
						assertSound.play();
					}
						
					
					processedWordIndexs.push(index);
				}
			}
			else{
				//, doesn't match
				newWord = spoken[index];
				color = "red";
			}
		}else{
			//The word has not been spoken (or detected)
			phraseCompleted = false;
			
			newWord = currentPhraseAsWords[index];
			color = "black";
		}
		htmlResult += `<span style="color: ${color};">${newWord} </span>`;
	});
	return htmlResult;
}


function clearAndFormatAsWordsArray(text){
	return text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "").toLowerCase().split(/\s+/);
}


function isMobile(){
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}