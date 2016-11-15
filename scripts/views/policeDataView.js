(function(module) {
  'use strict';
  var policeDataView = {};

  policeDataView.populateFilters = function() {
    var options;
    var template = Handlebars.compile($('#crimes-filter-template').text());
    options = policeData.crimeFilter()
    .map(function(crimes) {
      console.log(crimes, 'CRIMES ****');
      return template({val: crimes});
    });
    $('#crime-selector').append(options);
  };

  module.policeDataView = policeDataView;
}(window));
