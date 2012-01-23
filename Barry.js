(function(window) {

	function Barry() {
		this.initialize();
	}

	Barry.prototype = new BitmapAnimation(); // public properties:
	Barry.prototype.speed = 12;
	Barry.prototype.acc = 2;
	Barry.prototype.friction = 0.7;
	Barry.prototype.jumpSpeed = -20;
	Barry.prototype.movingRt = false;
	Barry.prototype.moving_h = false;
	Barry.prototype.jumping = true;
	Barry.prototype.vX = 0;
	Barry.prototype.vY = 0;

	// public properties
	Barry.prototypeSrc = null;

	// constructor:
	Barry.prototype.BitmapAnimation_initialize = Barry.prototype.initialize;
	Barry.prototype.BitmapAnimation_tick = Barry.prototype.tick; // unique to avoid overiding base class
	Barry.prototype.initialize = function() {
		this.spriteSrc = new Image(); //load Sprite
		this.spriteSrc.onload = this.handleSpriteLoaded;
		this.spriteSrc.onerror = this.handleImageError;
		this.spriteSrc.src = "sprites/barry.png";
		this.vX = 0;
		this.vY = 0;
	}

	// public methods:
	Barry.prototype.handleSpriteLoaded = function() {
		var data = {
			images: [this],
			frames: {
				width: 50,
				height: 87,
				regX: 30,
				regY: 82
			},
			animations: {
				stand: [1, 1, "stand"],
				walk: [2, 11, "walk"],
				up: [12, 12, "up"],
				upSide: [13, 13, "upSide"],
				down: [14, 14, "down"],
				downSide: [15, 15, "downSide"],
				duck: [16, 16, "duck"],
				walkePee: [17, 22, "walkPee"],
				standPee: [23, 23, "standPee"],
				die: [24, 34, "die"]
			}
		};
		var spriteSheet = new SpriteSheet(data);
		SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false); // create a BitmapAnimation instance to display and play back the sprite sheet:
		Barry.prototype.BitmapAnimation_initialize(spriteSheet);
		Barry.prototype.x = 150;
		Barry.prototype.y = 150;

		// fire barryLoaded Event
		fireEvent('barryLoaded', document);
	} 

	// called if there is an error loading the image (usually due to a 404)
	Barry.prototype.handleImageError = function(e) {
		console.log("Error Loading Image : " + e.target.src);
	}
	Barry.prototype.jump = function() {
		if (!this.jumping) {
			this.vY = this.jumpSpeed;
			this.jumping = true;
		}
	}
	Barry.prototype.tick = function() {

		// velocity stuff
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
			if (Math.abs(this.vX) < .5) {
				this.vX = 0;
				this.gotoAndPlay('stand');
				this.paused = true;
			}
		}

		// animate depending on velocity
		if (this.vY === 0) {
			if (this.vX > 0) {
				if (this.currentAnimation != 'walk') {
					this.gotoAndPlay('walk');
				}
			} else if (this.vX < 0) {
				if (this.currentAnimation != 'walk_h') {
					this.gotoAndPlay('walk_h');
				}
			}
		} else if (this.vY < 0 && this.vX < 0) {
			this.gotoAndPlay('upSide_h');
		} else if (this.vY < 0 && this.vX > 0) {
			this.gotoAndPlay('upSide');
		} else if (this.vY < 0 && this.vX === 0) {
			this.gotoAndPlay('up');
		} else if (this.vY > 0 && this.vX < 0) {
			this.gotoAndPlay('downSide_h');
		} else if (this.vY > 0 && this.vX > 0) {
			this.gotoAndPlay('downSide');
		} else {
			this.gotoAndPlay('down');
		}
		
	}

	window.Barry = Barry;
}(window));
