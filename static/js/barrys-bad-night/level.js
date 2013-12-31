define([
  'barrys-bad-night/globals',
  'barrys-bad-night/player',
  'easel'
], function (Globals, Player) {

  function Level(title, tiles, playerStart) {
    this.initialize(title, tiles, playerStart);
  }

  var l = Level.prototype = new createjs.Container();

  l.Container_initialize = l.initialize;

  l.initialize = function (title, tiles, playerStart) {
    this.Container_initialize();
    this.tiles = tiles;
    this.title = title;
    this.width = tiles[0].length * Globals.tileSize;
    this.height = tiles.length * Globals.tileSize;
    this.tileContainer = new createjs.Container();
    this.drawTiles(tiles);
  };

  l.drawTiles = function (tiles) {
    var i = 0;

    for (i; i < tiles.length; i += 1) {
      var n = 0;
      for (n; n < tiles[i].length; n += 1) {
        var ts = Globals.tileSize;
        switch (tiles[i][n]) {
          case 1:
            // Square
            var g = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, ts, ts),
              t = new createjs.Shape();
            t.initialize(g);
            t.x = n * ts;
            t.y = i * ts;
            this.tileContainer.addChild(t);
            break;

          case 2:
            // Slope Left
            var g = new createjs.Graphics().beginFill("#000000").moveTo(0, ts).lineTo(ts, ts).lineTo(ts, 0).endFill(),
              t = new createjs.Shape();
            t.initialize(g);
            t.x = n * Globals.tileSize;
            t.y = i * Globals.tileSize;
            this.tileContainer.addChild(t);
            break;

          case 3:
            // Slope Right
            var g = new createjs.Graphics().beginFill("#000000").moveTo(0, 0).lineTo(ts, ts).lineTo(0, ts).endFill(),
              t = new createjs.Shape();
            t.initialize(g);
            t.x = n * Globals.tileSize;
            t.y = i * Globals.tileSize;
            this.tileContainer.addChild(t);
            break;
        }
      }
    }
    this.addChild(this.tileContainer);
    this.tileContainer.cache(0, 0, this.width, this.height);
    this.tileContainer.removeAllChildren();
  };

  return Level;

});