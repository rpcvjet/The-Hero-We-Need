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
    policeDataArray.sort(function(a, b){
      return b.at_scene_time - a.at_scene_time;
    });
    $('#police-data .reported-crimes').remove();
    policeDataArray.map(function(data){
      $('#police-data').append(policeData.renderTable(data));
    });
    $('#lastmodified').empty().append(new Date(localStorage.lastMod));
    mapsDataView.renderMaps(policeDataArray);
    policeDataView.handleCrimeTypeFilters();
  };

  policeDataView.handleCrimeTypeFilters = function() {
    $('#crime-selector-form').one('change', 'select', function() {
      $(this).parent().siblings('#zip-selector').children().children().val('');
      var filtervalue = $(this).val();
      if(filtervalue !== ''){
        var crime = this.id.replace('-selector', '');
        page('/' + crime + '/' + $(this).val().replace(/ /g, '+').replace(/\//g, '%2F').replace(/\,/g, '%2C').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\-/g, '%2D'));
      } else {
        page('/');
      }
    });
  };

  policeDataView.handleZipFilters = function() {
    $('#zip-selector').on('click','button', function(e) {
      e.preventDefault();
      $(this).parent().parent().siblings('#crime-selector-form').children().val('');
      var filtervalue = $(this).siblings().val();
      if(filtervalue !== ''){
        if (policeData.allZips.indexOf(filtervalue) !== -1) {
          page('/zip/' + filtervalue);
        } else {
          alert('Please provide a Seattle City Zipcode');
          $(this).siblings().val('');
        }
      } else {
        page('/');
      }
    });
  };

  policeDataView.handleResetButton = function() {
    $('#reset-button').on('click','button', function(e) {
      e.preventDefault();
      $(this).parent().siblings('#crime-selector-form').children().val('');
      $(this).parent().siblings('#zip-selector').children().children().val('');
      page('/');
    });
  };

  policeDataView.handleZipFilters();
  policeDataView.handleResetButton();

  module.policeDataView = policeDataView;
}(window));
