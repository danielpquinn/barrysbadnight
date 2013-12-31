requirejs.config({
  'paths': {
    'jquery': '../bower_components/jquery/jquery'
  }
});

require([
  'mobile-app'
], function (App) {

  "use strict";

  window.app = new App();

});