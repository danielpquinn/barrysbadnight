define([
  'barrys-bad-night/globals',
  'barrys-bad-night/level',
  'barrys-bad-night/camera',
  'barrys-bad-night/player',
  'barrys-bad-night/projectiles',
  'easel'
], function (Globals, Level, Camera, Player, projectiles) {


  function BarrysBadNight(canvasId) {
    this.io = io.connect();
    this.stage = new createjs.Stage(document.getElementById(canvasId));
    this.level = null;
    this.players = [];
    this.projectiles = [];
    this.camera = null;
    this.bindEvents();
    window.BarrysBadNight = this;
  };

  var b = BarrysBadNight.prototype;

  b.bindEvents = function () {
    var self = this;

    createjs.Ticker.on('tick', function () {
      self.updateStage();
    });

    self.io.on('connection data', function (data) { self.onConnectionData(data); });
    self.io.on('player connected', function (data) { self.addPlayer(data.id); });
    self.io.on('player disconnected', function (data) { self.removePlayer(data.id); });
    self.io.on('key pressed', function (data) { self.onKeyPressed(data); });
    self.io.on('key released', function (data) { self.onKeyReleased(data); });
    self.io.on('projectile fired', function (data) { self.onProjectileFired(data); });
  };

  b.onConnectionData = function (data) {
    var self = this;

    _.each(data.players, function (player) {
      console.log(player);
      self.addPlayer(player.id);
    });
  };

  b.addPlayer = function (id) {
    var player = new Player(id);

    player.x = 100;
    player.y = 100;

    this.players.push(player);
    this.level.addChild(player);
    this.camera.focus(player);
    console.log(this.players);
  };

  b.addProjectile = function (id) {
    
  };

  b.removePlayer = function (id) {
    console.log(_.findWhere(this.players, {id: id}));
    this.level.removeChild(_.findWhere(this.players, {id: id}));
    this.players = _.without(this.players, _.findWhere(this.players, {id: id}));
  };

  b.onKeyPressed = function (data) {
    _.findWhere(this.players, {id: data.id}).handleKeyDown({
      keyCode: data.keyCode
    });
  };

  b.onKeyReleased = function (data) {
    _.findWhere(this.players, {id: data.id}).handleKeyUp({
      keyCode: data.keyCode
    });
  };

  b.onProjectileFired = function (data) {
    _.findWhere(this.players, {id: data.id}).fireProjectile(data.vX, data.vY);
  };

  b.onStageTick = function (e) {
    var self = this;

    _.each(self.level.children, function (innerChild) {
      self.doCollisions(innerChild);
    });
    self.camera.follow();
  };

  b.updateStage = function (e) {
    var self = this;

    self.stage.update();
  };

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
  };

  b.loadLevel = function (levelData) {
    var self = this;

    $.ajax({
      url: levelData
    }).done(function(data) {
      self.level = new Level(data.title, data.tiles, data.playerStart);
      self.camera = new Camera(self.stage, self.level);
      self.stage.addChild(self.level);
      self.stage.on('tick', function (e) {
        self.onStageTick(e);
      });
    });
  };

  return BarrysBadNight;

});