'use strict';
(function(module) {
  var aboutController = {};

  aboutController.reveal = function() {
    /* TODO: DONE Use your DOM skills to reveal only the articles section! */
    $('.abouttextarea').hide();
    $('#aboutSection').show();
  };

  module.aboutController = aboutController;
})(window);
