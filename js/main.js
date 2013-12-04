require.config({
  'shim': {
    'easel': {
      'exports': 'createjs'
    }
  },
  'paths': {
    'jquery': 'vendor/jquery',
    'easel': 'vendor/easel',
    'underscore': 'vendor/underscore'
  }
});

require([
  'jquery',
  'barrys-bad-night/globals',
  'barrys-bad-night/barrysBadNight',
  'easel',
  'underscore'
], function ($, Globals, BarrysBadNight) {

  // Wait for DOM
  $(document).ready(function (e) {

    // Simple pubsub
    var topics = {},
      $fps = $('#fps');

    $.Topic = function (id) {
      var callbacks,
        topic = id && topics[id];

      if (!topic) {
        callbacks = $.Callbacks();
        topic = {
          publish: callbacks.fire,
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove
        }
        if (id) {
          topics[ id ] = topic;
        }
      };
      return topic;
    }

    // Create new game instance
    var game = new BarrysBadNight('game-canvas');

    // Create global reference
    window.GAME = game;

    game.loadLevel('data/level1.json');
    
    // Set frames per second
    createjs.Ticker.setFPS(Globals.fps);

    // start game loop
    createjs.Ticker.addEventListener('tick', function (e) {
      game.update();
      $fps.text(Math.floor(createjs.Ticker.getMeasuredFPS()));
    });

  });
});