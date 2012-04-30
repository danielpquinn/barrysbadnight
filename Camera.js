(function(window) {

	function Camera(stage, container, focalPoint) {
		this.initialize(stage, container, focalPoint);
	}

	Camera.prototype.initialize = function(stage, container, focalPoint) {
		this.offsetX = jQuery(stage.canvas).width() / 2;
		this.offsetY = jQuery(stage.canvas).height() / 2;
		this.container = container;
		this.focalPoint = focalPoint;

		this.minX = ((this.container.levelData.width * TILESIZE) * -1) + (jQuery(stage.canvas).width());
		this.minY = ((this.container.levelData.height * TILESIZE) * -1) + (jQuery(stage.canvas).height());

		console.log('offsetX: ' + this.offsetX);
		console.log('offsetY: ' + this.offsetY);
		console.log('minX: ' + this.minX);
		console.log('minY: ' + this.minY);

	}

	Camera.prototype.update = function() {
		this.container.x = ((this.focalPoint.x * -1) + this.offsetX);
		this.container.y = ((this.focalPoint.y * -1) + this.offsetY);
		if (this.container.x > 0) {
			this.container.x = 0;
		} else if (this.container.x < this.minX) {
			this.container.x = this.minX;
		}

		if (this.container.y > 0) {
			this.container.y = 0;
		} else if (this.container.y < this.minY) {
			this.container.y = this.minY;
		}



	}

	Camera.prototype.focus = function(focalPoint) {
		this.focalPoint = focalPoint;
	}

	window.Camera = Camera;

}(window));