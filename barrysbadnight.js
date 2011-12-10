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

var btnLeft;
var btnRight;
var btnUpLeft;
var btnUpRight;

// register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
	canvas = document.getElementById('canvas');
	btnLeft = document.getElementById('btn-left');
	btnUpLeft = document.getElementById('btn-up-left');
	btnRight = document.getElementById('btn-right');
	btnUpRight = document.getElementById('btn-up-right');
    stage = new Stage(canvas);
    stage.name = 'gameCanvas';
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
	barry = new Barry();
	//wait for sprite to load
	window.addEventListener('barryLoaded', handleBarryLoaded, false); //false to get it in bubble not capture.
}

// Custom generic event to help simulate synchronous sprite loading
function fireEvent(name, target) {
	//Ready: create a generic event
	var evt = document.createEvent('Events');
	//Aim: initialize it to be the event we want
	evt.initEvent(name, true, true); //true for can bubble, true for cancelable
	//FIRE!
	target.dispatchEvent(evt);
}

function handleBarryLoaded() {
    btnLeft.addEventListener('touchstart', handleRt, true);
    btnLeft.addEventListener('touchend', handleRtLift, true);
    btnUpLeft.addEventListener('touchstart', handleUp, true);
    btnUpLeft.addEventListener('touchend', handleUpLift, true);
    btnRight.addEventListener('touchstart', handleLf, true);
    btnRight.addEventListener('touchend', handleLfLift, true);
    btnUpRight.addEventListener('touchstart', handleUp, true);
    btnUpRight.addEventListener('touchend', handleUpLift, true);
	stage.addChild(barry);
	Ticker.setInterval(35);
	Ticker.addListener(window);
}

//allow for arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLf(); break;
		case KEYCODE_RIGHT: handleRt(); break;
		case KEYCODE_UP:	handleUp(); break;
	}
}

function handleKeyUp(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLfLift(); break;
		case KEYCODE_RIGHT: handleRtLift(); break;
		case KEYCODE_UP:	handleUpLift(); break;
	}
}

// Key handlers
function handleLf(event) {
    event.preventDefault();
    if(!lfHeld) {
        lfHeld = true;
        barry.movingLf = true;
    }
}

function handleRt(event) {
    event.preventDefault();
    if(!rtHeld) {
        rtHeld = true;
        barry.movingRt = true;
    }
}

function handleUp(event) {
    event.preventDefault();
    if(!upHeld) {
        upHeld = true;
        barry.jump();
    }
}
function handleLfLift(event) {
    event.preventDefault();
    lfHeld = false;
    barry.movingLf = false;
}

function handleRtLift(event) {
    event.preventDefault();
    rtHeld = false;
    barry.movingRt = false;
}

function handleUpLift(event) {
    event.preventDefault();
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