define([
  'barrys-bad-night/globals'
], function (Globals) {

  function Camera(stage, container) {
    this.initialize(stage, container);
  }

  var c = Camera.prototype;

  c.initialize = function (stage, container) {
    this.offsetX = Globals.gameWidth / 2;
    this.offsetY = Globals.gameHeight / 2;
    this.container = container;
    this.bottomBound = Globals.gameHeight + this.container.height * -1;
    this.rightBound = Globals.gameWidth + this.container.width * -1;
  }

  c.follow = function () {
    if (!this.focalPoint) { return; }
    this.container.x = (this.focalPoint.x * -1) + this.offsetX;
    this.container.y = (this.focalPoint.y * -1) + this.offsetY;
    if (this.container.x > 0) {
      this.container.x = 0;
    }
    if (this.container.x < this.rightBound) {
      this.container.x = this.rightBound;
    }
    if (this.container.y < this.bottomBound) {
      this.container.y = this.bottomBound;
    }
  }

  c.focus = function (focalPoint) {
    this.focalPoint = focalPoint;
  }

  return Camera;

});