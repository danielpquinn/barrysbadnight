var canvas;	// place to put canvas
var stage;	// stage for game to take place on
var level;	// current level
var barry;	// our hero, Barry
var lfHeld;	// is key pressed
var rtHeld;	// is key pressed
var upHeld;	// is key pressed
var httpRequest;	// for level loading
var xIndex;
var yIndex;
var currBrick;

var KEYCODE_SPACE = 32;	//usefull keycode
var KEYCODE_UP = 38;	//usefull keycode
var KEYCODE_LEFT = 37;	//usefull keycode
var KEYCODE_RIGHT = 39;	//usefull keycode

var btnLeft;
var btnRight;
var btnUpLeft;
var btnUpRight;

// register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

// custom generic event to help simulate synchronous asset loading
function fireEvent(name, target) {
	// ready: create a generic event
	var evt = document.createEvent('Events');
	//Aim: initialize it to be the event we want
	evt.initEvent(name, true, true); //true for can bubble, true for cancelable
	// FIRE!
	target.dispatchEvent(evt);
}

function init() {
	// scroll below URL bar in mobile devices
	window.scrollTo(0, window.height);
	// grab some stuff out of the dom
	canvas = document.getElementById('canvas');
	btnLeft = document.getElementById('btn-left');
	btnUpLeft = document.getElementById('btn-up-left');
	btnRight = document.getElementById('btn-right');
	btnUpRight = document.getElementById('btn-up-right');
	$fps = $('#fps');
	stage = new Stage(canvas);
	stage.name = 'gameCanvas';
	
	window.addEventListener('levelLoaded', handleLevelLoaded, false);	// load first level data
	level = new Level('levels/level1.json');
}

function handleLevelLoaded() {
	stage.addChild(level);
	barry = new Barry();
	//wait for sprite to load
	window.addEventListener('barryLoaded', handleBarryLoaded, false); //false to get it in bubble not capture.
}

function handleBarryLoaded() {
	btnLeft.addEventListener('touchstart', handleLf, true);
	btnLeft.addEventListener('touchend', handleLfLift, true);
	btnUpLeft.addEventListener('touchstart', handleUp, true);
	btnUpLeft.addEventListener('touchend', handleUpLift, true);
	btnRight.addEventListener('touchstart', handleRt, true);
	btnRight.addEventListener('touchend', handleRtLift, true);
	btnUpRight.addEventListener('touchstart', handleUp, true);
	btnUpRight.addEventListener('touchend', handleUpLift, true);
	stage.addChild(barry);
	Ticker.setInterval(30);
	Ticker.addListener(window);
}

//allow for arrow control scheme
function handleKeyDown(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLf(e); break;
		case KEYCODE_RIGHT: handleRt(e); break;
		case KEYCODE_UP:	handleUp(e); break;
	}
}

function handleKeyUp(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLfLift(e); break;
		case KEYCODE_RIGHT: handleRtLift(e); break;
		case KEYCODE_UP:	handleUpLift(e); break;
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
		//$fps.html(Ticker.getFPS());

    // move barry
		
    barry.x += barry.vX;
    barry.y += barry.vY;
    
  	rIndex = Math.floor((barry.x + 25) / 40);
  	lIndex = Math.floor((barry.x - 25) / 40);
  	yIndex = Math.floor(barry.y / 40);

    if(barry.vY > 0) {
	    if(level.levelData.levelArray[yIndex][rIndex] === 1 || level.levelData.levelArray[yIndex][lIndex] === 1) {
	    	barry.y = yIndex * 40;
	    	barry.vY = 0;
	    	barry.jumping = false;	 
	    }
    }
    if(barry.vX > 0) {
	    if(level.levelData.levelArray[yIndex - 1][rIndex] === 1) {
	    	barry.x = (rIndex * 40) - 25;
    	}
    }
    if(barry.vX < 0) {
	    if(level.levelData.levelArray[yIndex - 1][lIndex] === 1) {
	    	barry.x = ((lIndex + 1) * 40) + 25;
    	}
    }
    
	// update the stage:
	stage.update();
}