var canvas;	// place to put canvas
var stage;	// stage for game to take place on
var level;	// current level
var barry;	// our hero, Barry
var pObjs; // Array of objects to act on
var lfHeld;	// is key pressed
var rtHeld;	// is key pressed
var upHeld;	// is key pressed
var httpRequest;	// for level loading

var KEYCODE_SPACE = 32;	//usefull keycode
var KEYCODE_UP = 38;	//usefull keycode
var KEYCODE_LEFT = 37;	//usefull keycode
var KEYCODE_RIGHT = 39;	//usefull keycode

var GRAVITY = 1.5;	// global gravity
var TILESIZE = 40;	// global tilesize

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
	pObjs = [];
	stage = new Stage(canvas);
	stage.name = 'gameCanvas';
	
	// load first level data
	window.addEventListener('levelLoaded', handleLevelLoaded, false);
	level = new Level('levels/level1.json');
}

function handleLevelLoaded() {
	stage.addChild(level);
	barry = new Barry();
	window.addEventListener('barryLoaded', handleBarryLoaded, false);
}

function handleBarryLoaded() {
	pObjs.push(barry);
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
    lfHeld = true;
}

function handleRt(event) {
    event.preventDefault();
    rtHeld = true;
}

function handleUp(event) {
    event.preventDefault();
    upHeld = true;
}
function handleLfLift(event) {
    event.preventDefault();
    lfHeld = false;
}

function handleRtLift(event) {
    event.preventDefault();
    rtHeld = false;
}

function handleUpLift(event) {
    event.preventDefault();
    upHeld = false;
}

function tick() {

	for (var i = 0; i < pObjs.length; i++) {
		
		var ob = pObjs[i],
			h = ob.width / 2,
			a = level.levelData.levelArray;

		ob.vY += GRAVITY;
		ob.y += ob.vY;

		if (Math.abs(ob.vX) < 1) {
			ob.vX = 0;
		}

		// Downward collision detection
		if (ob.vY > 0) {
			if (	a[Math.floor(ob.y / TILESIZE)][Math.floor(ob.x / TILESIZE)] === 1
				||	a[Math.floor(ob.y / TILESIZE)][Math.floor((ob.x + h) / TILESIZE)] === 1
				||	a[Math.floor(ob.y / TILESIZE)][Math.floor((ob.x - h) / TILESIZE)] === 1) {
				ob.vY *= ob.restitution;
				if (Math.abs(ob.vY) < 1) { ob.vY = 0 }
				ob.y = Math.floor(ob.y / TILESIZE) * TILESIZE;
			}
		}

		// Collision detect moving right
		if (ob.vX > 0) {
			if (	a[Math.ceil((ob.y - 1) / TILESIZE) - 1][Math.floor((ob.x + h) / TILESIZE)] === 1) {
				ob.vX *= ob.restitution;
				ob.x = (Math.ceil(ob.x / TILESIZE) * TILESIZE) - h;
			}
		}

		// Collision detect moving left
		if (ob.vX < 0) {
			if (	a[Math.floor((ob.y - 1) / TILESIZE)][Math.floor((ob.x - h) / TILESIZE)] === 1) {
				ob.vX *= ob.restitution;
				ob.x = (Math.floor(ob.x / TILESIZE) * TILESIZE) + h;
			}
		}

		ob.x += Math.floor(ob.vX);

	}

	// update the stage:
	stage.update();
}