(function(window) { //


    function Barry() {
        this.initialize();
    }
    
    Barry.prototype = new Container();
    
    // public properties:	
    Barry.prototype.vX = 0;
    Barry.prototype.vY = 0;
    
    // public properties
    Barry.prototype.spriteSrc = null;
    Barry.prototype.sprite = null;

    // constructor:
    Barry.prototype.Container_initialize = Barry.prototype.initialize;

    // unique to avoid overiding base class
    Barry.prototype.initialize = function() {
        this.Container_initialize();
        this.spriteSrc = new Image();
        //load Sprite
        this.spriteSrc.onload = this.handleSpriteLoaded;
        this.spriteSrc.src = "sprites/barry.png";
        this.vX = 0;
        this.vY = 0;
    }

    // public methods:
    Barry.prototype.handleSpriteLoaded = function() {
        var frameData = {
            stand: [0, 0],
            walk: [1, 10],
            up: [11, 11],
            upside: [12, 12],
            down: [13, 13],
            downside: [14, 14],
            duck: [15, 15],
            walkpee: [16, 21],
            standpee: [22, 22],
            die: [23, 35]
        };
        // create a new sprite sheet from the loaded image, and define the animation sequences in it.
        // for example, {walkUpRight:[0,19]} defines an animation sequence called "walkUpRight" that
        // will play back frames 0 to 19 inclusive.
        var spriteSheet = new SpriteSheet(this, 26, 44, frameData);
        // generate a new sprite sheet based on the old one, but adding new flipped animation sequences.
        // the second param defines what new sequences to create, and how to flip them. It uses the format:
        // {nameOfFlippedSequence:["derivativeSequence", flipHorizontally, flipVertically, optionNameOfNextSequence]}
        spriteSheet = SpriteSheetUtils.flip(spriteSheet, {
            walkUpLeft: ["walk", true, false],
            walkPeeLeft: ["walkpee", true, false]
        });
        // create a BitmapSequence instance to display and play back the sprite sheet:
        Barry.prototype.sprite = new BitmapSequence(spriteSheet);
        // set the registration point (the point it will be positioned and rotated around)
        // to the center of the frame dimensions:
        Barry.prototype.sprite.regX = Barry.prototype.sprite.spriteSheet.frameWidth / 2 | 0;
        Barry.prototype.sprite.regY = Barry.prototype.sprite.spriteSheet.frameHeight / 2 | 0;
        Barry.prototype.sprite.x = 150;
        Barry.prototype.sprite.y = 150;
        // start playing the first sequence:
        Barry.prototype.sprite.gotoAndPlay("stand"); //animate
        
    	// fire barryLoaded Event
    	fireEvent('barryLoaded', document);
        
    }
    Barry.prototype.walkRight = function() {}
    Barry.prototype.tick = function() {
        //move by velocity
        this.x += this.vX;
        this.y += this.vY;
    }
    window.Barry = Barry;
}(window));
