(function(module) {
  'use strict';
  var policeDataView = {};

  policeDataView.populateFilters = function() {
    var options;
    var template = Handlebars.compile($('#crimes-filter-template').text());
    options = policeData.crimeFilter()
    .map(function(crimes) {
      return template({val: crimes});
    });
    $('#crime-selector').append(options);
  };

  policeDataView.renderPage = function(policeDataArray) {
    $('#police-data .reported-crimes').remove();
    policeDataArray.map(function(data){
      $('#police-data').append(policeData.renderTable(data));
    });
    mapsDataView.renderMaps(policeDataArray);
    policeDataView.handleCrimeTypeFilters();
  };

  policeDataView.handleCrimeTypeFilters = function() {
    $('#filters').one('change', 'select', function() {
      var filtervalue = $(this).val();
      if(filtervalue!==''){
        console.log('true');
        var crime = this.id.replace('-selector', '');
        page('/' + crime + '/' + $(this).val().replace(/\W+/g, '+'));
      }else{
        
        page('/');
      }
    });
  };

  module.policeDataView = policeDataView;
}(window));
