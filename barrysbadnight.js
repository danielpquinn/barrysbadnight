var canvas;       // place to put canvas
var stage;        // stage for game to take place on
var level;        // current level
var lvlArr;       // tile array
var barry;        // our hero, Barry
var camera;       // camera
var lfHeld;       // is key pressed
var rtHeld;       // is key pressed
var upHeld;       // is key pressed
var httpRequest;  // for level loading
var fpsBox;       // FPS Counter
var throwStart;   // keep track of throw distance
var throwing;     // override touches while throwing

var KEYCODE_SPACE  = 32;  //usefull keycode
var KEYCODE_UP     = 38;  //usefull keycode
var KEYCODE_LEFT   = 37;  //usefull keycode
var KEYCODE_RIGHT  = 39;  //usefull keycode

var GRAVITY  = 1.5;   // global gravity
var TILESIZE = 40;    // global tilesize
var DEBUG    = true;  // debug mode
var POBJS;            // Array of objects to act on

// register key functions
document.onkeydown    = handleKeyDown;
document.onkeyup      = handleKeyUp;
document.ontouchstart = handleTouchStart;
document.ontouchend   = handleTouchEnd;
document.onmousedown  = handleMouseDown;
document.onmouseup  = handleMouseUp;

// custom generic event to help simulate synchronous asset loading
function fireEvent(name, target) {
	var evt = document.createEvent('Events');
	evt.initEvent(name, true, true); //true for can bubble, true for cancelable
	target.dispatchEvent(evt);
}

function init() {
	// grab some stuff out of the dom
	canvas = document.getElementById('canvas');
	fpsBox = document.getElementById('fps');
	POBJS  = [];
	stage  = new Stage(canvas);
	stage.name = 'gameCanvas';

	// load first level data
	window.addEventListener('levelLoaded', handleLevelLoaded, false);
	// level = new Level('http://50.56.75.247/bbn/levels/level1.json');
	level = new Level('levels/level1.json');
}

function handleLevelLoaded() {
	lvlArr = level.levelData.levelArray;
	stage.addChild(level);
	barry = new Barry(level.levelData.startPos[1] * TILESIZE, level.levelData.startPos[0] * TILESIZE);
	addEnemies();
	window.addEventListener('barryLoaded', handleBarryLoaded, false);
}

function handleBarryLoaded() {
	
	var n;

	POBJS.push(barry);
	level.addChild(barry);
	Ticker.setInterval(30);
	Ticker.addListener(window);
	camera = new Camera(stage, level, barry);

	console.log(POBJS.length);
	for(n in POBJS) {
		// Nesting ifs again ;)
		if(n.name != 'projectile') {
			console.log(n);
			if(this.x < (POBJS[n].x + this.radius) && this.x > (POBJS[n].x - this.radius)) {
				console.log('hit');
			}
		}
	}

}

function addEnemies() {
	for (var i = 0; i < lvlArr.length; i++) {
		for (var n = 0; n < lvlArr[0].length; n++) {
			switch (lvlArr[i][n]) {
			case 1:
				break;
			case 2:
				var enemy = new Crabity(n * TILESIZE, i * TILESIZE);
				POBJS.push(enemy);
				level.addChild(enemy);
				break;
			}
		}
	}
}

//allow for arrow control scheme
function handleKeyDown(e) {
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLf(e); break;
		case KEYCODE_RIGHT: handleRt(e); break;
		case KEYCODE_UP:	handleUp(e); break;
	}
}

function handleKeyUp(e) {
	switch(e.keyCode) {
		case KEYCODE_LEFT:	handleLfLift(e); break;
		case KEYCODE_RIGHT: handleRtLift(e); break;
		case KEYCODE_UP:	handleUpLift(e); break;
	}
}

function handleTouchStart(e) {
	e.preventDefault();
	var t = e.changedTouches[0];
	if (t.clientX < 860 && t.clientX > 100) {
		initThrow(t.clientX, t.clientY);
	}else if (t.clientX < 100 && t.clientY > 560) {
		handleRt(e);
	}else if (t.clientX > 860 && t.clientY > 560) {
		handleLf(e);
	}else {
		handleUp(e);
	}
}

function handleTouchEnd(e) {
	e.preventDefault();
	var t = e.changedTouches[0];
	if(throwing) {
		throwProjectile(t);
		throwing = false;
	}else if (t.clientX < 100 && t.clientY > 560) {
		handleRtLift(e);
	}else if (t.clientX > 860 && t.clientY > 560) {
		handleLfLift(e);
	}else {
		handleUpLift(e);
	}
}

function handleMouseDown(e) {
	e.preventDefault();
	if (e.clientX < 860 && e.clientX > 100) {
		initThrow(e.clientX, e.clientY);
	}else if (e.clientX < 100 && e.clientY > 560) {
		handleRt(e);
	}else if (e.clientX > 860 && e.clientY > 560) {
		handleLf(e);
	}else {
		handleUp(e);
	}
}

function handleMouseUp(e) {
	e.preventDefault();
	if(throwing) {
		throwProjectile(e);
		throwing = false;
	}else if (e.clientX < 100 && e.clientY > 560) {
		handleRtLift(e);
	}else if (e.clientX > 860 && e.clientY > 560) {
		handleLfLift(e);
	}else {
		handleUpLift(e);
	}
}

function initThrow(x, y) {
	throwing = true;
	throwStart = [x, y];
}

function throwProjectile(e) {
	var vX = (throwStart[0] - e.clientX) * -0.1 + barry.vX,
		vY = (throwStart[1] - e.clientY) * -0.1 + barry.vY,
		p = new Projectile(barry.x, barry.y - 40, vX, vY);
	POBJS.push(p);
	level.addChild(p);
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
		if ( lvlArr[Math.floor(ob.pY / TILESIZE)][Math.floor((ob.pX + (h / 2)) / TILESIZE)] === 1 ||	lvlArr[Math.floor(ob.pY / TILESIZE)][Math.floor((ob.pX - (h / 2)) / TILESIZE)] === 1) {
			ob.vY *= ob.restitution;
			ob.pY = Math.floor(ob.pY / TILESIZE) * TILESIZE;
		}
	} else if (ob.vY < 0) {
		if ( lvlArr[Math.ceil((ob.pY - ob.height) / TILESIZE - 1)][Math.floor((ob.pX + h - (h / 2)) / TILESIZE)] === 1 || lvlArr[Math.ceil((ob.pY - ob.height) / TILESIZE - 1)][Math.floor((ob.pX - h + (h / 2)) / TILESIZE)] === 1) {
			ob.vY = 1;
			ob.pY = Math.ceil(ob.pY / TILESIZE) * TILESIZE;
		}
	}

	// Horizontal collision detection
	if (ob.vX > 0) {
		if (	lvlArr[Math.floor((ob.pY - 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1 ||	lvlArr[Math.floor((ob.pY - ob.height + 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1 ||	lvlArr[Math.floor((ob.pY - (ob.height / 2) + 1) / TILESIZE)][Math.floor((ob.pX + h) / TILESIZE)] === 1) {
			ob.vX *= ob.restitution;
			ob.pX = (Math.ceil(ob.pX / TILESIZE) * TILESIZE) - h;
		}
	} else if (ob.vX < 0) {
		if (lvlArr[Math.floor((ob.pY - 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1 ||	lvlArr[Math.floor((ob.pY - ob.height + 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1 ||	lvlArr[Math.floor((ob.pY - (ob.height / 2) + 1) / TILESIZE)][Math.floor((ob.pX - h) / TILESIZE)] === 1) {
			ob.vX *= ob.restitution;
			ob.pX = (Math.floor(ob.pX / TILESIZE) * TILESIZE) + h;
		}
	}

	ob.x = Math.floor(ob.pX);
	ob.y = Math.floor(ob.pY);
}

function tick() {

	for (var i = 0; i < POBJS.length; i++) {
		checkCollisions(POBJS[i]);
	}

	if (DEBUG) {
		fpsBox.innerHTML = Math.floor(Ticker.getMeasuredFPS());
	}

	// update camera:
	camera.update();

	// update the stage:
	stage.update();

}