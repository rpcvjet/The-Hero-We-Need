'use strict';
(function(module) {
  var aboutmeDataController = {};

  aboutmeDataController.reveal = function() {
    $('.barny').fadeOut();
    $('#about').fadeIn();
  };

  module.aboutmeDataController = aboutmeDataController;
}(window));
