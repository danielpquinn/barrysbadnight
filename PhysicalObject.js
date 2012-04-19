(function(window) {

	function PhysicalObject(w, h, vx, vy, f, r) {
		this.initialize(w, h, vx, vy, f, r);
	}

	PhysicalObject.prototype.width = 0;
	PhysicalObject.prototype.height = 0;
	PhysicalObject.prototype.vX = 0;
	PhysicalObject.prototype.vY = 0;
	PhysicalObject.prototype.friction = 1;
	PhysicalObject.prototype.restitution = 0.5;

	PhysicalObject.prototype.initialize = function(w, h, vx, vy, f, r) {
		this.width = w;
		this.height = h;
		this.vX = vx;
		this.vY = vy;
		this.friction = f;
		this.restitution = r;
	}

	PhysicalObject.prototype.tick = function() {
		this.vX += GRAVITY;
	}

	window.PhysicalObject = PhysicalObject;

}(window));