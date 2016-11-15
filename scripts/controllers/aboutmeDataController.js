'use strict';
(function(module) {
  var aboutmeDataController = {};

  aboutmeDataController.reveal = function() {
    $('.barny').hide();
    $('#about').show();
  };

  module.aboutmeDataController = aboutmeDataController;
}(window));
