(function(window) {

	function Projectile(startX, startY, vX, vY) {
		this.radius = 10;
		this.pX = startX;
		this.pY = startY;
		this.vX = vX;
		this.vY = vY;
		this.restitution = -0.5;
		this.width = 18;
		this.height = 18;
		this.regX = 9;
		this.regY = 18;
		this.name = 'projectile';
		this.life = 150;
	}

	Projectile.prototype = new Bitmap('sprites/projectile.png');
	jQuery.extend(Projectile.prototype, physicalObject, Projectile.prototype);

	Projectile.prototype.die = function() {
		this.parent.removeChild(this);
		POBJS.splice(POBJS.indexOf(this), 1);
	};

	Projectile.prototype.tick = function() {

		var n = 0;
		for(n = 0; n < POBJS.length; n++) {
			// Nesting ifs again ;)
			if(POBJS[n].name != 'projectile') {
				if(this.x < (POBJS[n].x + this.radius) && this.x > (POBJS[n].x - this.radius) && this.y < (POBJS[n].y + this.radius) && this.y > (POBJS[n].y - this.radius)) {
					if(POBJS[n].onHit) {
						this.life = 0;
						POBJS[n].onHit();
					}
				}
			}
		}
		this.life--;
		if(this.life < 1) {
			this.die();
		}
	};

	window.Projectile = Projectile;

}(window));