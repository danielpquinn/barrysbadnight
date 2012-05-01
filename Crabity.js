(function(window) {

	function Crabity(startX, startY) {
		this.initialize(startX, startY);
	}

	Crabity.prototype = new BitmapAnimation();

	Crabity.prototype.BitmapAnimation_initialize = Crabity.prototype.initialize;

	// unique to avoid overiding base class
	Crabity.prototype.BitmapAnimation_tick = Crabity.prototype.tick;
	
	Crabity.prototype.initialize = function(startX, startY) {

		jQuery.extend(this, physicalObject, this);

		this.width = 40;
		this.height = 40;
		this.pX = startX;
		this.pY = startY;
		this.vX = 5;
		this.friction = 0.99;
		this.restitution = -0.4;
		this.spriteSrc = new Image();

		var self = this;

		function randomMovement() {
			self.vX += self.vX > 0 ? 5 : -5;
			self.vY = (Math.random() * 20 + 10) * -1;
		}

		this.t = setInterval(function(){randomMovement()}, Math.random() * 5000 + 3000);

		// load Sprite
		this.spriteSrc.onload = this.handleSpriteLoaded;
		this.spriteSrc.onerror = this.handleImageError;
		this.spriteSrc.src = "sprites/crabity.png";

	}

	// public methods:
	Crabity.prototype.handleSpriteLoaded = function() {
		var data = {
			images: [this],
			frames: {
				width: 40,
				height: 40,
				regX: 20,
				regY: 40
			},
			animations: {
				alert: [37, 80, "alert"],
				hit: [81, 92, "hit"],
				still: [0, 36, "still"],
				attack: [93, 96, "attack"]
			}
		};
		var spriteSheet = new SpriteSheet(data);
		SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);

		// create a BitmapAnimation instance to display and play back the sprite sheet:
		Crabity.prototype.BitmapAnimation_initialize(spriteSheet);
		Crabity.prototype.x = Crabity.prototype.pX;
		Crabity.prototype.y = Crabity.prototype.pY;
		
		// fire crabityLoaded Event
		fireEvent('crabityLoaded', document);
	}

	// called if there is an error loading the image (usually due to a 404)
	Crabity.prototype.handleImageError = function(e) {
		console.log("Error Loading Image : " + e.target.src);
	}

	Crabity.prototype.tick = function() {

		this.vX *= this.friction;
		if (this.vY < 0 && this.vX < 0) {
			this.gotoAndPlay('attack');
		} else if (this.vY < 0 && this.vX > 0) {
			this.gotoAndPlay('attack_h');
		} else if (this.vY < 0 && this.vX === 0) {
			this.gotoAndPlay('alert_h');
		} else if (this.vY > 0 && this.vX < 0) {
			this.gotoAndPlay('alert');
		} else if (this.vY > 0 && this.vX > 0) {
			this.gotoAndPlay('downSide');
		} else {
			this.gotoAndPlay('still');
		}
	}

	window.Crabity = Crabity;

}(window));
