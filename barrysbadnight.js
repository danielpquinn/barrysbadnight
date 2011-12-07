var canvas;     // place to put canvas
var stage;      // stage for game to take place on
var currLevel;  // current level
var barry;      // our hero, Barry
var lfHeld;      // is key pressed
var rtHeld;      // is key pressed
var upHeld;      // is key pressed
var httpRequest;    // for level loading

var KEYCODE_SPACE = 32;		//usefull keycode
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode

// register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
	canvas = document.getElementById("canvas");
    stage = new Stage(canvas);
    stage.name = "gameCanvas";
    // load first level data
    loadLevel('levels/level1.json');
}

// Load level via ajax
function loadLevel(url) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = handleLevelLoaded;
    httpRequest.open('GET', url);
    httpRequest.send();
}
    
function handleLevelLoaded() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            initLevel(httpRequest.responseText);
        } else {
          alert('There was a problem loading the level.');
        }
    }
}

function initLevel(lvl) {
    var json = JSON.parse(lvl);
    console.log(json);
	barry = new Barry();
	//wait for sprite to load
	window.addEventListener("barryLoaded", handleBarryLoaded, false); //false to get it in bubble not capture.
}

// Custom generic event to help simulate synchronous sprite loading
function fireEvent(name, target) {
	//Ready: create a generic event
	var evt = document.createEvent("Events");
	//Aim: initialize it to be the event we want
	evt.initEvent(name, true, true); //true for can bubble, true for cancelable
	//FIRE!
	target.dispatchEvent(evt);
}

function handleBarryLoaded() {
	stage.addChild(barry);
	Ticker.addListener(window);
}

//allow for arrow control scheme
function handleKeyDown(e) {
    e.preventDefault();
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLf(); break;
		case KEYCODE_RIGHT: handleRt(); break;
		case KEYCODE_UP:	handleup(); break;
	}
}

function handleKeyUp(e) {
    e.preventDefault();
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLfLift(); break;
		case KEYCODE_RIGHT: handleRtLift(); break;
		case KEYCODE_UP:	handleuplift(); break;
	}
}

// Key handlers
function handleLf() {
    if(!lfHeld) {
        lfHeld = true;
        barry.movingLf = true;
    }
}

function handleRt() {
    if(!rtHeld) {
        rtHeld = true;
        barry.movingRt = true;
    }
}

function handleup() {
    if(!upHeld) {
        upHeld = true;
        barry.jump();
    }
}
function handleLfLift() {
    lfHeld = false;
    barry.movingLf = false;
}

function handleRtLift() {
    rtHeld = false;
    barry.movingRt = false;
}

function handleuplift() {
    upHeld = false;
}

function tick() {

    // move barry
    barry.x += barry.vX;
    barry.y += barry.vY;
    
    // handle Barry's collisions with tiles on map
    if(barry.y > canvas.height) {
        barry.vY = 0;
        barry.jumping = false;
        barry.y = canvas.height;
    }
    
	// update the stage:
	stage.update();
}