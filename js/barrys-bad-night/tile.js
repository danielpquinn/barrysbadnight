define([
  'easel'
], function () {

  function Tile(x, y, w, h) {
    this.initialize(x, y, w, h);
  }

  var t = Tile.prototype = new createjs.Shape();

  t.x = 0;
  t.y = 0;

  t.Shape_initialize = t.initialize;

  t.initialize = function (x, y, w, h) {
    var that = this;
    var g = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, w, h);
    that.Shape_initialize(g);
    that.x = x * w;
    that.y = y * h;
  }

  return Tile;

});