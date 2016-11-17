'use strict';
(function(module) {
  var homeController = {};

  homeController.reveal = function() {
    $('.barny').fadeIn();
  };

  module.homeController = homeController;
}(window));
