var canvas;  // place to put canvas
var stage;  // stage for game to take place on
var level;  // current level
var lvlArr;  // tile array
var barry;  // our hero, Barry
var enemies;  // array of enemies
var camera;  // camera
var pObjs;  // Array of objects to act on
var lfHeld;  // is key pressed
var rtHeld;  // is key pressed
var upHeld;  // is key pressed
var httpRequest;  // for level loading
var fpsBox;  // for level loading

var KEYCODE_SPACE = 32;  //usefull keycode
var KEYCODE_UP = 38;  //usefull keycode
var KEYCODE_LEFT = 37;  //usefull keycode
var KEYCODE_RIGHT = 39;  //usefull keycode

var GRAVITY = 1.5;  // global gravity
var TILESIZE = 40;  // global tilesize
var DEBUG = true;  // debug mode

// register key functions
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
document.ontouchstart = handleTouchStart;
document.ontouchend = handleTouchEnd;

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
	// grab some stuff out of the dom
	canvas = document.getElementById('canvas');
	fpsBox = document.getElementById('fps');
	pObjs = [];
	stage = new Stage(canvas);
	stage.name = 'gameCanvas';

	// load first level data
	window.addEventListener('levelLoaded', handleLevelLoaded, false);
	level = new Level('levels/level1.json');
}

function handleLevelLoaded() {
	lvlArr = level.levelData.levelArray;
	stage.addChild(level);
	barry = new Barry(level.levelData.startPos[1] * TILESIZE, level.levelData.startPos[0] * TILESIZE);
	crabity = new Crabity(300, 300);
	window.addEventListener('barryLoaded', handleBarryLoaded, false);
	window.addEventListener('crabityLoaded', handleCrabityLoaded, false);
}

function handleBarryLoaded() {
	pObjs.push(barry);
	level.addChild(barry);
	Ticker.setInterval(20);
	Ticker.addListener(window);
	camera = new Camera(stage, level, barry);
}

function handleCrabityLoaded() {
	pObjs.push(crabity);
	level.addChild(crabity);
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

function handleTouchStart(e) {
	e.preventDefault();
	var t = e.changedTouches[0];
	if (t.clientX < 480 && t.clientY > 320) {
		handleLf(e);
	}else if (t.clientX > 480 && t.clientY > 320) {
		handleRt(e);
	}else {
		handleUp(e);
	}
}

function handleTouchEnd(e) {
	e.preventDefault();
	var t = e.changedTouches[0];
	if (t.clientX < 480 && t.clientY > 320) {
		handleLfLift(e);
	}else if (t.clientX > 480 && t.clientY > 320) {
		handleRtLift(e);
	}else {
		handleUpLift(e);
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

function checkCollisions(ob) {

	var h = ob.width / 2;

	ob.vY += GRAVITY;
	ob.pY += ob.vY;
	ob.pX += ob.vX;

	if (Math.abs(ob.vX) < 0.1) {
		ob.vX = 0;
	}

	// Collision detection moving vertically
	if (ob.vY > 0) {
		if (	lvlArr[Math.floor(ob.pY / TILESIZE)][Math.floor((ob.pX + (h / 2)) / TILESIZE)] === 1
			||	lvlArr[Math.floor(ob.pY / TILESIZE)][Math.floor((ob.pX - (h / 2)) / TILESIZE)] === 1) {
			ob.vY *= ob.restitution;
			ob.pY = Math.floor(ob.pY / TILESIZE) * TILESIZE;
		}
	} else if (ob.vY < 0) {
		if (	lvlArr[Math.ceil((ob.pY - ob.height) / TILESIZE - 1)][Math.floor((ob.pX + h - (h / 2)) / TILESIZE)] === 1
			||	lvlArr[Math.ceil((ob.pY - ob.height) / TILESIZE - 1)][Math.floor((ob.pX - h + (h / 2)) / TILESIZE)] === 1) {
			ob.vY = 1;
			ob.pY = Math.ceil(ob.pY / TILESIZE) * TILESIZE;
		}
	}

	// Collision detection moving horizontally
	if (ob.vX > 0) {
		if (	lvlArr[Math.floor((ob.pY - 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1
			||	lvlArr[Math.floor((ob.pY - ob.height + 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1
			||	lvlArr[Math.floor((ob.pY - (ob.height / 2) + 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1) {
			ob.vX *= ob.restitution;
			ob.pX = (Math.ceil(ob.pX / TILESIZE) * TILESIZE) - h;
		}
	} else if (ob.vX < 0) {
		if (lvlArr[Math.floor((ob.pY - 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1
			||	lvlArr[Math.floor((ob.pY - ob.height + 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1
			||	lvlArr[Math.floor((ob.pY - (ob.height / 2) + 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1) {
			ob.vX *= ob.restitution;
			ob.pX = (Math.floor(ob.pX / TILESIZE) * TILESIZE) + h;
		}
	}

	ob.x = Math.floor(ob.pX);
	ob.y = Math.floor(ob.pY);
}

function tick() {

	for (var i = 0; i < pObjs.length; i++) {
		checkCollisions(pObjs[i]);
	}

	if (DEBUG) {
		fpsBox.innerHTML = Math.floor(Ticker.getMeasuredFPS());
	}

	// update camera:
	camera.update();

	// update the stage:
	stage.update();

}