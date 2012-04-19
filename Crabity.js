(function(window) {
	function Crabity() {
		this.initialize();
	}
	Crabity.prototype = new BitmapAnimation(); // public properties:
	Crabity.prototype.speed = 4;
	Crabity.prototype.acc = 4;
	Crabity.prototype.friction = 0.6;
	Crabity.prototype.gravity = 2;
	Crabity.prototype.jumpSpeed = -15;
	Crabity.prototype.movingRt = false;
	Crabity.prototype.moving_h = false;
	Crabity.prototype.jumping = true;
	Crabity.prototype.vX = 0;
	Crabity.prototype.vY = 0; // public properties
	Crabity.prototypeSrc = null; // constructor:
	Crabity.prototype.BitmapAnimation_initialize = Crabity.prototype.initialize;
	Crabity.prototype.BitmapAnimation_tick = Crabity.prototype.tick; // unique to avoid overiding base class
	Crabity.prototype.initialize = function() {
		this.spriteSrc = new Image(); //load Sprite
		this.spriteSrc.onload = this.handleSpriteLoaded;
		this.spriteSrc.onerror = this.handleImageError;
		this.spriteSrc.src = "sprites/crabity.png";
		this.vX = 0;
		this.vY = 0;
	} // public methods:
	Crabity.prototype.handleSpriteLoaded = function() {
		var data = {
			images: [this],
			frames: {
				width: 80,
				height: 80,
				regX: 25,
				regY: 77
			},
			animations: {
				// stand: [1, 1, "stand"],
				// walk: [2, 11, "walk"],
				// up: [12, 12, "up"],
				// upSide: [13, 13, "upSide"],
				// down: [14, 14, "down"],
				// downSide: [15, 15, "downSide"],
				// duck: [16, 16, "duck"],
				// walkePee: [17, 22, "walkPee"],
				// standPee: [23, 23, "standPee"],
				// die: [24, 34, "die"]
				
				alert: [37, 80, "alert"],
				hit: [81, 92, "hit"],
				static: [0, 36, "static"],
				attack: [93, 96, "attack"],
				stand: [0, 36, "stand"],
				walk: [93, 96, "walk"],
				up: [93, 96, "up"],
				upSide: [93, 96, "upSide"],
				down: [93, 96, "down"],
				downSide: [93, 96, "downSide"]
			}
		};
		var spriteSheet = new SpriteSheet(data);
		SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false); // create a BitmapAnimation instance to display and play back the sprite sheet:
		Crabity.prototype.BitmapAnimation_initialize(spriteSheet);
		Crabity.prototype.x = 150;
		Crabity.prototype.y = 150;
		// fire barryLoaded Event
		fireEvent('barryLoaded', document);
	} // called if there is an error loading the image (usually due to a 404)
	Crabity.prototype.handleImageError = function(e) {
		console.log("Error Loading Image : " + e.target.src);
	}
	Crabity.prototype.jump = function() {
		if (!this.jumping) {
			this.vY = this.jumpSpeed;
			this.jumping = true;
		}
	}
	Crabity.prototype.tick = function() { // velocity calculations
		if (this.movingRt) {
			if (this.vX < this.speed) {
				this.vX += this.acc;
			}
		}
		if (this.movingLf) {
			if (this.vX > this.speed * -1) {
				this.vX -= this.acc;
			}
		}
		if (!this.movingLf && !this.movingRt) {
			this.vX *= this.friction;
			if (Math.abs(this.vX) < 1) {
				this.vX = 0;
				this.x = Math.floor(this.x);
				this.gotoAndPlay('stand');
				this.paused = true;
			}
		}
		// animate depending on velocity
		if (this.vY === 0) {
			if (this.vX > 0) {
				if (this.currentAnimation != 'walk_h') {
					this.gotoAndPlay('walk_h');
				}
			} else if (this.vX < 0) {
				if (this.currentAnimation != 'walk') {
					this.gotoAndPlay('walk');
				}
			}
		} else if (this.vY < 0 && this.vX < 0) {
			this.gotoAndPlay('upSide');
		} else if (this.vY < 0 && this.vX > 0) {
			this.gotoAndPlay('upSide_h');
		} else if (this.vY < 0 && this.vX === 0) {
			if (this.currentAnimation != 'up') {
				this.gotoAndPlay('up');
			}
		} else if (this.vY > 0 && this.vX < 0) {
			this.gotoAndPlay('downSide');
		} else if (this.vY > 0 && this.vX > 0) {
			this.gotoAndPlay('downSide_h');
		} else {
			if (this.currentAnimation != 'walk') {
				this.gotoAndPlay('walk');
			}
		} // gravity rides everything
		this.vY += this.gravity;
	}
	window.Crabity = Crabity;
}(window));
