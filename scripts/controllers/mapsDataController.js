'use strict';
(function(module) {
  var mapsDataController = {};

  mapsDataController.reveal = function() {
    $('.barny').fadeOut();
    $('#map').fadeIn();
  };

  module.mapsDataController = mapsDataController;
}(window));
