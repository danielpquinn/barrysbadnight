var canvas;     // place to put canvas
var STAGE;      // STAGE for game to take place on
var imgSeq = new Image();		//bmp of the sprite sheet
var barry;      //our hero, Barry
var shootHeld;      // is key pressed
var lfHeld;      // is key pressed
var rtHeld;      // is key pressed
var upHeld;      // is key pressed

var KEYCODE_SPACE = 32;		//usefull keycode
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_W = 87;			//usefull keycode
var KEYCODE_A = 65;			//usefull keycode
var KEYCODE_D = 68;			//usefull keycode

function fireEvent(name, target) {
	//Ready: create a generic event
	var evt = document.createEvent("Events")
	//Aim: initialize it to be the event we want
	evt.initEvent(name, true, true); //true for can bubble, true for cancelable
	//FIRE!
	target.dispatchEvent(evt);
}

function init() {
	canvas = document.getElementById("canvas");
    
    STAGE = new Stage(canvas);
    STAGE.name = "gameCanvas";

	barry = new Barry();
	//wait for sprite to load
	
	window.addEventListener("barryLoaded", handleBarryLoaded, false); //false to get it in bubble not capture.

}

function handleBarryLoaded() {

	// create a new STAGE and point it at our canvas:

	// grab canvas width and height for later calculations:
	var w = canvas.width;
	var h = canvas.height;
	
	console.log(Barry.prototype.sprite);
	STAGE.addChild(Barry.prototype.sprite);
	Ticker.addListener(window);
	
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
    console.log(e.keyCode);
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_SPACE:	shootHeld = true; break;
		case KEYCODE_A:
		case KEYCODE_LEFT:	lfHeld = true; break;
		case KEYCODE_D:
		case KEYCODE_RIGHT: rtHeld = true; break;
		case KEYCODE_W:
		case KEYCODE_UP:	upHeld = true; break;
	}
}

function handleKeyUp(e) {
	//cross browser issues exist
	if(!e){ var e = window.event; }
	switch(e.keyCode) {
		case KEYCODE_SPACE:	shootHeld = false; break;
		case KEYCODE_A:
		case KEYCODE_LEFT:	lfHeld = false; break;
		case KEYCODE_D:
		case KEYCODE_RIGHT: rtHeld = false; break;
		case KEYCODE_W:
		case KEYCODE_UP:	upHeld = false; break;
	}
}

function tick() {

    if(upHeld) {
        console.log('upHeld');
    }

	// update the STAGE:
	STAGE.update();
}