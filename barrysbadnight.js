var TILESIZE = 40;
var GRAVITY = 2;
var KEYCODE_SPACE = 32;	//usefull keycode
var KEYCODE_UP = 38;	//usefull keycode
var KEYCODE_LEFT = 37;	//usefull keycode
var KEYCODE_RIGHT = 39;	//usefull keycode

var canvas;				// place to put canvas
var stage;				// stage for game to take place on
var level;				// current level
var barry;				// our hero, Barry
var lfHeld;				// is key pressed
var rtHeld;				// is key pressed
var upHeld;				// is key pressed
var httpRequest;		// for level loading
var projectiles;		// array of projectiles
var clickStart;			// used to calculate projectile vector

// Events
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);

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
	stage = new Stage(canvas);
	stage.name = 'gameCanvas';
	
	window.addEventListener('levelLoaded', handleLevelLoaded, false);	// load first level data
	level = new Level('levels/level1.json');
}

function handleLevelLoaded() {
	stage.addChild(level);
	console.log(stage);
	canvas.addEventListener('mousedown', handleMouseDown, false);
	projectiles = [];
	barry = new Barry();
	//wait for sprite to load
	window.addEventListener('barryLoaded', handleBarryLoaded, false); //false to get it in bubble not capture.
}

function handleBarryLoaded() {
	stage.addChild(barry);
	Ticker.setInterval(30);
	Ticker.addListener(window);
}

function handleMouseDown(e) {
	clickStart = [e.x, e.y];
}

function handleMouseUp(e) {
	var vX = (clickStart[0] - e.x) / 8 + barry.vX;
	var vY = (clickStart[1] - e.y) / 8 + barry.vY;
	var projectile = new Projectile(vX, vY);
	projectile.x = barry.x;
	projectile.y = barry.y - 25;
	projectiles.push(projectile);
	stage.addChild(projectile);
}

function handleStart(e) {
	
}

function handleEnd(e) {
	
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

function moveBarry() {

    // move barry

	// gravity rides everything
	barry.vY += GRAVITY;
		
    barry.x += barry.vX;
    barry.y += barry.vY;
    
  	rIndex = Math.floor((barry.x + 15) / TILESIZE);
  	lIndex = Math.floor((barry.x - 15) / TILESIZE);
 
  	if(barry.vY < 0) {
	  	yIndex = Math.floor((barry.y + TILESIZE) / TILESIZE);
	}else {
	  	yIndex = Math.floor((barry.y) / TILESIZE);
	}

    if(barry.vX > 0) {
	    if(level.levelData.levelArray[yIndex - 2][rIndex] === 1 || level.levelData.levelArray[yIndex - 1][rIndex] === 1) {
	    	barry.x = (rIndex * TILESIZE) - 16;
	    	barry.vX = 0;
  			rIndex = Math.floor((barry.x + 15) / TILESIZE);
    	}
    }
    if(barry.vX < 0) {
	    if(level.levelData.levelArray[yIndex - 2][lIndex] === 1 || level.levelData.levelArray[yIndex - 1][lIndex] === 1) {
	    	barry.x = (lIndex + 1) * TILESIZE + 16;
	    	barry.vX = 0;
  			lIndex = Math.floor((barry.x - 15) / TILESIZE);
    	}
    }

    if(barry.vY > 0) {
	    if(level.levelData.levelArray[yIndex][rIndex] === 1 || level.levelData.levelArray[yIndex][lIndex] === 1) {
	    	barry.y = yIndex * TILESIZE;
	    	barry.vY = 0;
	    	barry.jumping = false;
	    }
    }

    if(barry.vY < 0) {
	    if(level.levelData.levelArray[yIndex - 3][rIndex] === 1 || level.levelData.levelArray[yIndex - 3][lIndex] === 1) {
	    	barry.y = yIndex * TILESIZE;
	    	barry.vY = 0;
	    	barry.jumping = false;
	    }
    }

    //Draw Barry on whole pixel
    barry.x = Math.round(barry.x);
}

function moveProjectiles() {
	for(var i = 0; i < projectiles.length; i++) {
		var p = projectiles[i];
		p.vY += GRAVITY / 2;
		p.x += p.vX;
		p.y += p.vY;
		if(p.vY > 0) {
			if(level.levelData.levelArray[Math.floor(p.y / TILESIZE)][Math.floor(p.x / TILESIZE)] === 1) {
				p.y = Math.floor(p.y / TILESIZE) * TILESIZE;
				p.vY *= -1;
			}
		}
		if(p.vX > 0) {
			if(level.levelData.levelArray[Math.floor(p.y/TILESIZE)][Math.floor(p.x / TILESIZE)] === 1) {
				p.x = Math.floor(p.x / TILESIZE) * TILESIZE - 5;
				p.vX *= -1;
			}
		} else if(p.vX < 0) {
			if(level.levelData.levelArray[Math.floor(p.y / TILESIZE)][Math.floor(p.x / TILESIZE)] === 1) {
				p.x = Math.ceil(p.x / TILESIZE) * TILESIZE - 5;
				p.vX *= -1;
			}
		}
		p.life--;
		if(p.life === 0) {
			stage.removeChild(p);
			projectiles.splice(i, 1);
		}
	}
}

function handleCollisions() {
	
}

function tick() {
    
    // moveBarry();

    // moveProjectiles();

    handleCollisions();

	// update the stage:
	stage.update();
}