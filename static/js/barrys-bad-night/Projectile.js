define([
  'easel'
], function () {

  function Projectile(vX, vY) {
    this.vX = vX;
    this.vY = vY;
    this.initialize();
  }

  Projectile.prototype = new createjs.Shape();

  Projectile.prototype.Shape_initialize = Projectile.prototype.initialize;

  Projectile.prototype.initialize = function (vX, vY) {
    this.Shape_initialize();
    this.graphics.beginFill('#000000').drawRect();
  };

  return Projectile;

});