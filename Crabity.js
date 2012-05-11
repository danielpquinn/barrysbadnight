(function(window) {

	function Crabity(startX, startY) {
		this.initialize(startX, startY);
	}

	Crabity.prototype = new BitmapAnimation();

	Crabity.prototype.BitmapAnimation_initialize = Crabity.prototype.initialize;

	// unique to avoid overiding base class
	Crabity.prototype.BitmapAnimation_tick = Crabity.prototype.tick;
	
	Crabity.prototype.initialize = function(startX, startY) {

		var self = this,
			handleCrabityAlerted;

		jQuery.extend(this, physicalObject, this);

		self.width = 40;
		self.height = 40;
		self.alertDist = 300;
		self.angerDist = 200;
		self.state = 'stopped';
		self.angryAt = {};
		self.timeAware = 3000;
		self.awareTimer = 0;
		self.name = 'crabity';
		self.speed = 5;
		self.pX = startX;
		self.pY = startY;
		self.vX = 0;
		self.friction = 0.9;
		self.restitution = -0.5;
		self.spriteSrc = new Image();
		self.isAwareOf = [
			'barry'
		];

		self.rest = function() {
			console.log('resting');
			self.state = 'stopped';
			self.angryAt = {};
			self.vX = 0;
		};

		self.anger = function() {
			if(self.state != 'angered') {
				self.state = 'angered';
				console.log(self.state);
				this.vY = -15;
				self.awareTimer = setTimeout(function() {
					self.rest();
				}, self.timeAware);
			}
		};

		handleCrabityAlerted = function() {
			console.log('alerted');
			self.state = 'alerted';
		};

		window.addEventListener('crabityAlerted', handleCrabityAlerted, false);

		self.becomeAlert = function() {
			if(self.state != 'angered' && self.state != 'alerted') {
				fireEvent('crabityAlerted', document);
			}
		};

		// load Sprite
		self.spriteSrc.onload = self.handleSpriteLoaded;
		self.spriteSrc.onerror = self.handleImageError;
		self.spriteSrc.src = "sprites/crabity.png";

	};

	// public methods:
	Crabity.prototype.handleSpriteLoaded = function() {
		var data = {
			images: [this],
			frames: {
				width: 40,
				height: 40,
				regX: 20,
				regY: 38
			},
			animations: {
				attack: [93, 96, "attack"],
				stopped: [0, 36, "stopped"],
				hit: [81, 88, "hit"],
				alerted: [37, 80, "alerted"]
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

	};

	// called if there is an error loading the image (usually due to a 404)
	Crabity.prototype.handleImageError = function(e) {
		console.log("Error Loading Image : " + e.target.src);
	};

	Crabity.prototype.tick = function() {
		
		var n;
		for(n in POBJS) {
			// Nesting ifs ;)
			if(this.isAwareOf.hasValue(POBJS[n].name)) {
				if(Math.abs(POBJS[n].x - this.x) < this.angerDist && Math.abs(POBJS[n].y - this.y) < this.angerDist ) {
					this.angryAt = POBJS[n];
					this.anger();
				}else if(Math.abs(POBJS[n].x - this.x) < this.alertDist && Math.abs(POBJS[n].y - this.y) < this.alertDist ) {
					this.becomeAlert();
				}
			}
		}

		if (this.state === 'angered') {
			// Too much mathing?
			try {
				this.vX = this.speed * ((this.angryAt.x - this.x) / (Math.abs(this.x - this.angryAt.x)));
			}catch(err) {
				console.log(err);
			}
			if (this.vX < 0) {
				if (this.currentAnimation != 'attack') {
					this.gotoAndPlay('attack');
				}
			}else if (this.vX > 0) {
				if (this.currentAnimation != 'attack_h') {
					this.gotoAndPlay('attack_h');
				}
			}
		}else if (this.state === 'alerted') {
			if (this.currentAnimation != 'alerted') {
				this.gotoAndPlay('alerted');
			}
		}else if (this.vX === 0) {
			if (this.currentAnimation != 'stopped') {
				this.gotoAndPlay('stopped');
			}
		}

	};

	window.Crabity = Crabity;

}(window));
