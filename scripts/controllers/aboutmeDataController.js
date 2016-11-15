(function(module) {
  'use strict';
  var aboutmeDataController = {};

  aboutmeDataController.reveal = function() {
    $('#crimedata').hide();
    $('#about').show();
  };

  module.aboutmeDataController = aboutmeDataController;
}(window));
