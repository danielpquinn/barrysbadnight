require.config({
  'shim': {
    'easel': {
      'exports': 'createjs'
    }
  },
  'paths': {
    'jquery': '../bower_components/jquery/jquery',
    'easel': '../bower_components/easeljs/lib/easeljs-NEXT.min',
    'underscore': '../bower_components/underscore/underscore'
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
    $fps = $('#fps');

    // Create new game instance
    var game = new BarrysBadNight('game-canvas');

    // Create global reference
    window.GAME = game;

    game.loadLevel('data/level1.json');
    
    // Set frames per second
    createjs.Ticker.setFPS(Globals.fps);

    // start game loop
    createjs.Ticker.on('tick', function (e) {
      $fps.text(Math.floor(createjs.Ticker.getMeasuredFPS()));
    });

  });
});