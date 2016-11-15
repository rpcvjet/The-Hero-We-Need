'use strict';
(function(module) {
  var policeDataController = {};

  policeDataController.reveal = function() {
    $('.barny').hide();
    $('#crimedata').show();
  };

  module.policeDataController = policeDataController;
}(window));
