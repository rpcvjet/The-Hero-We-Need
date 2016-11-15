'use strict';
(function(module) {
  var policeDataController = {};

  policeDataController.reveal = function() {
    $('#about').hide();
    $('#crimedata').show();
  };

  module.policeDataController = policeDataController;
}(window));
