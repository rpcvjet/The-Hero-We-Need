'use strict';
(function(module) {
  var homeController = {};

  homeController.reveal = function() {
    $('.barny').show();
  };

  module.homeController = homeController;
}(window));
