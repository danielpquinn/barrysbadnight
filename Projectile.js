(function(window) {

//
function Projectile() {
	this.initialize();
}

Projectile.prototype = new Shape();

// static properties:

// public properties:
	
	Projectile.prototype.vX = 0;		//velocity X
	Projectile.prototype.vY = 0;		//velocity Y
	Projectile.prototype.life = 0;		//velocity Y
	
// constructor:
	Projectile.prototype.Shape_initialize = Projectile.prototype.initialize;	//unique to avoid overiding base class
	
	Projectile.prototype.initialize = function() {
		this.Shape_initialize(); // super call
		this.life = 200;
		this.getShape();
	}

// public methods:
	//handle drawing a Projectile
	Projectile.prototype.getShape = function() {
		
		//setup
		this.graphics.clear();
		this.graphics.beginStroke("#E7852E");
		this.graphics.beginFill("#FF9431");
		
		this.graphics.drawCircle(0, 0, 5);
	}


window.Projectile = Projectile;
}(window));