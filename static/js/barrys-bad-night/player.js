define([
  'barrys-bad-night/globals',
  'barrys-bad-night/projectiles',
  'barrys-bad-night/Projectile',
  'easel'
], function (Globals, projectiles, Projectile) {

  function Player(id) {
    this.initialize(id);
  }

  var p = Player.prototype = new createjs.Shape();

  p.vX = 0;
  p.vY = 0;
  p.rightPressed = false;
  p.leftPressed = false;
  p.upPressed = false;
  p.isJumping = false;
  p.width = 18;
  p.height = 38;

  p.Shape_initialize = p.initialize;

  p.initialize = function (id) {
    var g = new createjs.Graphics().beginFill('#'+Math.floor(Math.random()*16777215).toString(16)).drawRect(0, 0, 18, 38);
    this.Shape_initialize(g);
    this.id = id;
    this.cache(0, 0, this.width, this.height);
    this.snapToPixel = true;
    this.bindEvents();
  };

  p.bindEvents = function () {
    var self = this;
    document.addEventListener('keydown', function (e) {
      self.handleKeyDown(e);
    });
    document.addEventListener('keyup', function (e) {
      self.handleKeyUp(e);
    });
    p.on('tick', function (e) {
      self.onTick(e);
    });
  };

  p.handleKeyDown = function (e) {
    switch (e.keyCode) {
      case 39:
        this.rightPressed = true;
        return;
      case 37:
        this.leftPressed = true;
        return;
      case 38:
        this.upPressed = true;
        this.jump();
        return;
    }
  };

  p.handleKeyUp = function (e) {
    switch (e.keyCode) {
      case 39:
        this.rightPressed = false;
        return;
      case 37:
        this.leftPressed = false;
        return;
      case 38:
        this.upPressed = false;
        this.isJumping = false;
        return;
    }
  }

  p.jump = function () {
    if (this.vY === 0 && !this.isJumping) {
      this.isJumping = true;
      this.vY = Globals.jumpForce * -1;
    }
  };

  p.onTick = function (e) {
    this.vY += Globals.gravity;
    this.y += this.vY;
    if (this.rightPressed && this.vX <= Globals.maxSpeed) {
      this.vX += Globals.playerAcceleration;
    }
    if (this.leftPressed && this.vX >= Globals.maxSpeed * -1) {
      this.vX -= Globals.playerAcceleration;
    }
    if (Math.abs(this.vX) < 1) {
      this.vX = 0;
    }
    if (!this.rightPressed && !this.leftPressed) {
      this.vX *= Globals.friction;
    }
    this.x += this.vX;
  };

  p.fireProjectile = function (vX, vY) {

    projectiles.push(new Projectile(vX, vY));
  };

  return Player;

});