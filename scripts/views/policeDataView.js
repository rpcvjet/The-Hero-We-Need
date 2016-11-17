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
    $('#lastmodified').append(localStorage.lastMod);
    mapsDataView.renderMaps(policeDataArray);
    policeDataView.handleCrimeTypeFilters();
  };

  policeDataView.handleCrimeTypeFilters = function() {
    $('#filters').one('change', 'select', function() {
      var filtervalue = $(this).val();
      if(filtervalue!==''){
        console.log('true');
        var crime = this.id.replace('-selector', '');
        page('/' + crime + '/' + $(this).val().replace(/ /g,'+').replace(/\//g,'%2F').replace(/\,/g,'%2C').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\-/g,'%2D'));
      } else {
        page('/');
      }
    });
  };

  policeDataView.handleZipFilters = function() {
    $('#zip-selector').on('click','button', function(e) {
      e.preventDefault();
      var filtervalue = $(this).siblings().val();
      console.log(filtervalue);
      if(filtervalue!==''){
        console.log('true');
        page('/zip/' + filtervalue);
      }else{
        page('/');
      }
    });
  };

  policeDataView.handleZipFilters();

  module.policeDataView = policeDataView;
}(window));
