(function(window) {

    function Barry() {
        this.initialize();
    }
    
    Barry.prototype = new BitmapSequence();
    
    // public properties:
    Barry.prototype.speed = 10;
    Barry.prototype.acc = 2;
    Barry.prototype.friction = 0.6;
    Barry.prototype.gravity = 2;
    Barry.prototype.jumpSpeed = -20;
    Barry.prototype.movingRt = false;
    Barry.prototype.movingLf = false;
    Barry.prototype.jumping = true;
    Barry.prototype.vX = 0;
    Barry.prototype.vY = 0;
    
    // public properties
    Barry.prototypeSrc = null;

    // constructor:
    Barry.prototype.BitmapSequence_initialize = Barry.prototype.initialize;
    Barry.prototype.BitmapSequence_tick = Barry.prototype.tick;

    // unique to avoid overiding base class
    Barry.prototype.initialize = function() {
        this.spriteSrc = new Image();
        //load Sprite
        this.spriteSrc.onload = this.handleSpriteLoaded;
    	this.spriteSrc.onerror = this.handleImageError;
        this.spriteSrc.src = "sprites/barry.png";
        this.vX = 0;
        this.vY = 0;
    }

    // public methods:
    Barry.prototype.handleSpriteLoaded = function() {
        var frameData = {
            stand: [1, 1],
            walkRt: [2, 11],
            up: [12, 12],
            upRt: [13, 13],
            down: [14, 14],
            downRt: [15, 15],
            duck: [16, 16],
            walkpee: [17, 22],
            standpee: [23, 23],
            die: [24, 36]
        };
        
        var spriteSheet = new SpriteSheet(this, 26, 44, frameData);
        
        spriteSheet = SpriteSheetUtils.flip(spriteSheet, {
            upLf: ['upRt', true, false],
            downLf: ['downRt', true, false],
            walkLf: ["walkRt", true, false],
            walkPeelf: ["walkpee", true, false]
        });
        // create a BitmapSequence instance to display and play back the sprite sheet:
        Barry.prototype.BitmapSequence_initialize(spriteSheet);
        
        Barry.prototype.regX = Barry.prototype.spriteSheet.frameWidth / 2 | 0;
        Barry.prototype.regY = Barry.prototype.spriteSheet.frameHeight;
        Barry.prototype.x = 150;
        Barry.prototype.y = 150;
        
        // start playing the first sequence:
        Barry.prototype.gotoAndPlay("stand"); //animate
        
    	// fire barryLoaded Event
    	console.log(Barry.prototype);
    	fireEvent('barryLoaded', document);
        
    }

    //called if there is an error loading the image (usually due to a 404)
    Barry.prototype.handleImageError = function(e) {
    	console.log("Error Loading Image : " + e.target.src);
    }
    
    Barry.prototype.jump = function() {
        if(!this.jumping) {
            this.vY = this.jumpSpeed;
            this.jumping = true;
        }
    }
    
    Barry.prototype.tick = function() {
    
        // velocity calculations
        if(this.movingRt) {
            if(this.vX < this.speed) {
                this.vX += this.acc;
            }
        }
        if(this.movingLf) {
            if(this.vX > this.speed * -1) {
                this.vX -= this.acc;
            }
        }
        if(!this.movingLf && !this.movingRt) {
            this.vX *= this.friction;
            if(Math.abs(this.vX) < 1) {
                this.vX = 0;
                this.x = Math.floor(this.x);
                this.gotoAndPlay('stand');
                this.paused = true;
            }
        }
        
        // animate depending on velocity
        if(this.vY === 0) {
            if(this.vX > 0) {
                if(this.currentSequence != 'walkRt') {
                    this.gotoAndPlay('walkRt');
                }
            } else if (this.vX < 0) {
                if(this.currentSequence != 'walkLf') {
                    this.gotoAndPlay('walkLf');
                }
            }
        } else if(this.vY < 0 && this.vX < 0) {
            this.gotoAndPlay('upLf');
        } else if(this.vY < 0 && this.vX > 0) {
            this.gotoAndPlay('upRt');
        } else if(this.vY < 0 && this.vX === 0) {
            this.gotoAndPlay('up');
        } else if(this.vY > 0 && this.vX < 0) {
            this.gotoAndPlay('downLf');
        } else if(this.vY > 0 && this.vX > 0) {
            this.gotoAndPlay('downRt');
        } else {
            this.gotoAndPlay('down');
        }
        
        // gravity rides everything
        this.vY += this.gravity;
    }
    window.Barry = Barry;
}(window));
