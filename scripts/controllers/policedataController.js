'use strict';
(function(module) {
  var policeDataController = {};

  policeDataController.reveal = function() {
    $('.barny').fadeOut();
    $('#map').fadeIn();
    $('#crimedata').fadeIn();
    $('#lastmodified').fadeIn();
  };

  policeDataController.resetPage = function(){
    policeData.loadData(policeData.allIncidents);
  };

  policeDataController.loadByCrimeType = function(ctx, next) {
    var crimeData = function(crimes) {
      ctx.crimes = crimes;
      next();
    };
    policeData.findWhere(
      'initial_type_subgroup', ctx.params.crimeType.replace('+', ' '), crimeData
    );
  };

  policeDataController.loadByZip = function(ctx, next) {
    var crimeData = function(crimes) {
      ctx.crimes = crimes;
      next();
    };
    policeData.findWhere(
      'zip', ctx.params.zipcode, crimeData
    );
  };

  policeDataController.index = function(ctx, next) {
    if(ctx.crimes.length) {
      policeDataView.renderPage(ctx.crimes);
    }
  };

  module.policeDataController = policeDataController;
}(window));
