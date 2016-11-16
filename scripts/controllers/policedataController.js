'use strict';
(function(module) {
  var policeDataController = {};

  policeDataController.reveal = function() {
    $('.barny').hide();
    $('#crimedata').show();
  };

  policeDataController.loadByCrimeType = function(ctx, next) {
    var crimeData = function(crimes) {
      console.log('Crimes',crimes);
      ctx.crimes = crimes;
      next();
    };
    policeData.findWhere(
      'offense_type', ctx.params.crimeType.replace('+', ' '), crimeData
    );
  };

  policeDataController.index = function(ctx, next) {
    if(ctx.crimes.length) {
      policeDataView.renderPage(ctx.crimes);
    }
    // else {
    //   page('/');
    // }
  };

  module.policeDataController = policeDataController;
}(window));
