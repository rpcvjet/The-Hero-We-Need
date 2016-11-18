'use strict';
(function(module) {
  var homeController = {};
  homeController.reveal = function() {
    $('.barny').fadeIn();
    $('#about').hide();
  };
  module.homeController = homeController;
}(window));
