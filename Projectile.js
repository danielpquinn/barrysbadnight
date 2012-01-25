(function(window) {

//
function Projectile(vX, vY) {
	this.initialize(vX, vY);
}

Projectile.prototype = new Shape();

// static properties:

// public properties:
	
	Projectile.prototype.vX = 0;		//velocity X
	Projectile.prototype.vY = 0;		//velocity Y
	Projectile.prototype.life = 0;		//velocity Y
	Projectile.prototype.width = 0;
	Projectile.prototype.height = 0;
	
// constructor:
	Projectile.prototype.Shape_initialize = Projectile.prototype.initialize;	//unique to avoid overiding base class
	
	Projectile.prototype.initialize = function(vX, vY) {
		this.Shape_initialize(); // super call
		this.vX = vX;
		this.vY = vY;
		this.life = 50;
		this.width = 10;
		this.height = 10;
		this.getShape();
	}

// public methods:
	//handle drawing a Projectile
	Projectile.prototype.getShape = function() {
		
		//setup
		this.graphics.clear();
		this.graphics.beginStroke("#E7852E");
		this.graphics.beginFill("#FF9431");
		
		this.graphics.drawCircle(0, 0, this.width / 2);
	}


window.Projectile = Projectile;
}(window));