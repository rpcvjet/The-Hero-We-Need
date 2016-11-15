'use strict';
(function(module) {
  var mapsDataController = {};

  mapsDataController.reveal = function() {
    $('.barny').hide();
    $('#map').show();
  };

  module.mapsDataController = mapsDataController;
}(window));
