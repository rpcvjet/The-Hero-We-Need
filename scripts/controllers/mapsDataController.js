'use strict';
(function(module) {
  var mapsDataController = {};

  mapsDataController.reveal = function() {
    $('#about  ').hide();
    $('#crimedata').show();
  };

  module.mapsDataController = mapsDataController;
}(window));
