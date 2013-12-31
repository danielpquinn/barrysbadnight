define([
  'jquery'
], function ($) {

  function App() {
    this.initialize();
  }

  App.prototype.initialize = function () {
    this.io = io.connect();
    this.shouldEmit = true;
    this.touchStart = {
      x: 0,
      y: 0
    };
    this.touchEnd = {
      x: 0,
      y: 0
    };

    this.io.emit('mobile player connected');
    this.bindEvents();
  };

  App.prototype.launch = function (start, end) {
    this.io.emit('projectile fired', {
      vX: this.touchEnd.x - this.touchStart.x,
      vY: this.touchEnd.y - this.touchStart.y
    });
  };

  App.prototype.bindEvents = function () {
    var self = this;

    $('.launcher').on('touchstart', function (e) {
      self.touchStart.x = e.originalEvent.touches[0].clientX;
      self.touchStart.y = e.originalEvent.touches[0].clientY;
      console.log(self.touchStart);
    });

    $('.launcher').on('touchend', function (e) {
      self.touchEnd.x = e.originalEvent.changedTouches[0].clientX;
      self.touchEnd.y = e.originalEvent.changedTouches[0].clientY;
      console.log(self.touchEnd);
      self.launch();
    });

    $('.key').on('touchstart', function (e) {
      var keyCode = $(e.target).data('keycode');
      self.io.emit('key pressed', { keyCode: keyCode });
    });
    $('.key').on('touchend', function (e) {
      var keyCode = $(e.target).data('keycode');
      self.io.emit('key released', { keyCode: keyCode });
    });
  };

  return App;

});