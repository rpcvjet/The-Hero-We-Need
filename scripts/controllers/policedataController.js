'use strict';
(function(module) {
  var policeDataController = {};

  policeDataController.reveal = function() {
    $('.barny').fadeOut();
    $('#crimedata').fadeIn();
  };

  policeDataController.resetPage = function(){
    policeData.loadData(policeData.allIncidents);
  };

  policeDataController.loadByCrimeType = function(ctx, next) {
    var crimeData = function(crimes) {
      console.log('Crimes',crimes);
      ctx.crimes = crimes;
      next();
    };
    policeData.findWhere(
      'summarized_offense_description', ctx.params.crimeType.replace('+', ' '), crimeData
    );
  };

  policeDataController.loadByZip = function(ctx, next) {
    var crimeData = function(crimes) {
      console.log('Crimes',crimes);
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
    // else {
    //   page('/');
    // }
  };

  module.policeDataController = policeDataController;
}(window));
