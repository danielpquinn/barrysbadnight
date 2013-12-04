define([
  'barrys-bad-night/globals',
  'barrys-bad-night/level',
  'barrys-bad-night/camera',
  'easel'
], function (Globals, Level, Camera) {


  function BarrysBadNight(canvasId) {
    this.stage = new createjs.Stage(document.getElementById(canvasId));
    this.level = null;
    this.camera = null;
  }

  var b = BarrysBadNight.prototype;

  b.update = function (e) {
    var self = this;

    _.each(this.level.children, function (innerChild) {
      if (innerChild.tick) {
        innerChild.tick(e);
        self.doCollisions(innerChild);
      }
    });
    this.stage.update();
    this.camera.follow();
  }

  b.doCollisions = function (child) {
    var tIndex = Math.floor((child.y) / Globals.tileSize),
      rIndex = Math.floor((child.x + child.width) / Globals.tileSize),
      innerRIndex = Math.floor((child.x + child.width - 5) / Globals.tileSize),
      bIndex = Math.floor((child.y + child.height) / Globals.tileSize),
      lIndex = Math.floor(child.x / Globals.tileSize),
      innerLIndex = Math.floor((child.x + 5) / Globals.tileSize),
      yCollided = false,
      xCollided = false;

    if (child.vY < 0) {
      if (this.level.tiles[tIndex][innerRIndex] === 1 || this.level.tiles[tIndex][innerLIndex] === 1) {
        child.vY = 0;
        child.y = tIndex * Globals.tileSize + Globals.tileSize;
        tIndex = Math.floor((child.y + 1) / Globals.tileSize);
      }
    }

    if (child.vY > 0) {
      if (this.level.tiles[bIndex][innerRIndex] === 1 || this.level.tiles[bIndex][innerLIndex] === 1) {
        child.vY = 0;
        child.y = bIndex * Globals.tileSize - child.height;
        bIndex = Math.floor((child.y - 1 + child.height) / Globals.tileSize);
      }
      if (this.level.tiles[bIndex][innerRIndex] === 2) {
        child.vY = 0;
        child.y = (bIndex * Globals.tileSize - child.height) + (Globals.tileSize - ((child.x + child.width - 5) % Globals.tileSize));
        return;
      }
      if (this.level.tiles[bIndex][innerLIndex] === 3) {
        child.vY = 0;
        child.y = (bIndex * Globals.tileSize - child.height) + ((child.x + 5) % Globals.tileSize);
        return;
      }
    }

    if (child.vX > 0) {
      if (this.level.tiles[bIndex][rIndex] === 1 || this.level.tiles[tIndex][rIndex] === 1 || this.level.tiles[tIndex + 1][rIndex] === 1) {
        child.vX = 0;
        child.x = rIndex * Globals.tileSize - child.width;
      }
    }

    if (child.vX < 0) {
      if (this.level.tiles[bIndex][lIndex] === 1 || this.level.tiles[tIndex][lIndex] === 1 || this.level.tiles[tIndex + 1][lIndex] === 1) {
        child.vX = 0;
        child.x = lIndex * Globals.tileSize + Globals.tileSize;
      }
    }
  }

  b.loadLevel = function (levelData) {
    var self = this;

    $.ajax({
      url: levelData
    }).done(function(data) {
      self.level = new Level(data.title, data.tiles, data.playerStart);
      self.camera = new Camera(self.stage, self.level);
      self.camera.focus(self.level.player);
      self.stage.addChild(self.level);

      $.Topic('gameLoaded').publish(self);

    });
  }

  return BarrysBadNight;

});