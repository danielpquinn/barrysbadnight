(function(window) {

	function Projectile(startX, startY, vX, vY) {
		this.pX = startX;
		this.pY = startY;
		this.vX = vX;
		this.vY = vY;
		this.restitution = -0.8;
		this.width = 18;
		this.height = 18;
		this.regX = 9;
		this.regY = 18;
		this.name = 'projectile';
	}

	Projectile.prototype = new Bitmap('sprites/projectile.png');
	jQuery.extend(Projectile.prototype, physicalObject, Projectile.prototype);

	Projectile.prototype.life = 150;

	Projectile.prototype.tick = function() {
		this.life--;
		if(this.life < 1) {
			this.parent.removeChild(this);
			pObjs.splice(pObjs.indexOf(this), 1);
		}
	};

	window.Projectile = Projectile;

}(window));