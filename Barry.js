(function(window) {

	function Barry(startX, startY) {
		this.initialize(startX, startY);
	}

	Barry.prototype = new BitmapAnimation();

	jQuery.extend(Barry.prototype, physicalObject, Barry.prototype);

	// public properties:
	Barry.prototype.jumpSpeed = -20;
	Barry.prototype.jumping = true;
	Barry.prototype.name = 'barry';

	Barry.prototype.BitmapAnimation_initialize = Barry.prototype.initialize;

	// unique to avoid overiding base class
	Barry.prototype.BitmapAnimation_tick = Barry.prototype.tick;
	
	Barry.prototype.initialize = function(startX, startY) {

		var self = this;

		self.width = 32;
		self.height = 80;
		self.speed = 10;
		self.acc = 4;
		self.pX = startX;
		self.pY = startY;
		self.restitution = 0;
		self.spriteSrc = new Image();
		self.state = 'alive';
		self.isHurtBy = [
			'crabity'
		]

		// load Sprite
		self.spriteSrc.onload = self.handleSpriteLoaded;
		self.spriteSrc.onerror = self.handleImageError;
		self.spriteSrc.src = "sprites/barry.png";

	};

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
		SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);

		// create a BitmapAnimation instance to display and play back the sprite sheet:
		Barry.prototype.BitmapAnimation_initialize(spriteSheet);
		Barry.prototype.x = Barry.prototype.pX;
		Barry.prototype.y = Barry.prototype.pY;
		
		// fire barryLoaded Event
		fireEvent('barryLoaded', document);
	};

	// called if there is an error loading the image (usually due to a 404)
	Barry.prototype.handleImageError = function(e) {
		console.log("Error Loading Image : " + e.target.src);
	};

	Barry.prototype.die = function() {
		this.state = 'dying';
		fireEvent('barryDying', document);
	};

	Barry.prototype.tick = function() {

		if(this.state === 'dying') {
			if(this.currentFrame === 34) {
				this.state = 'dead';
				this.gotoAndStop(33);
				fireEvent('barryDied', document);
			}else if (this.currentAnimation != 'die') {
				this.gotoAndPlay('die');
			}
		} else if(this.state != 'dead') {

			var n;
			for(n in POBJS) {
				// Deeper and deeper ;)
				if(this.isHurtBy.hasValue(POBJS[n].name)) {
					if(Math.abs(POBJS[n].x - this.x) < this.width && Math.abs(POBJS[n].y - this.y) < this.width ) {
						this.die();
					}
				}
			}

			if (lfHeld) {
				if (this.vX >= this.speed * -1) {
					this.vX -= this.acc;
				}
			} else if (rtHeld) {
				if (this.vX <= this.speed) {
					this.vX += this.acc;
				}
			} else {
				this.vX *= this.friction;
			}

			if (upHeld && this.vY === 0) {
				this.vY = this.jumpSpeed;
				this.jumping = true;
			}

			// animate depending on velocity
			if (this.vY === 0 && this.vX === 0) {
				this.gotoAndPlay('stand');
				this.paused = true;
			}
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
	};

	window.Barry = Barry;

}(window));
