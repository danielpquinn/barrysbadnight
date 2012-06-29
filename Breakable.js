;(function(window) {
	
	// Breakable tile
	function Breakable(startX, startY) {
		this.initialize(startX, startY);
	}

	Breakable.prototype = new Bitmap('images/breakable.png');

	Breakable.prototype.BitmapAnimation_initialize = Breakable.prototype.initialize;

	Breakable.prototype.initialize = function(startX, startY) {
		var self = this;

		self.x = startX;
		self.y = startY;
	}

	Breakable.prototype.onHit = function() {
		console.log(this);
		this.parent.removeChild(this);
		BREAKABLES.splice(BREAKABLES.indexOf(this), 1);
	}

	window.Breakable = Breakable;

}(window));