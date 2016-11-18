(function(module) {
  'use strict';

  policeData.allZips = ['98101', '98102', '98103', '98104', '98105', '98106', '98107', '98108', '98109', '98112', '98115', '98116', '98117', '98118', '98119', '98121', '98122', '98125', '98126', '98133', '98134', '98136', '98144', '98146', '98154', '98164', '98174', '98177', '98178', '98195', '98199'];

  function policeData(incident){
    var date = new Date(incident.at_scene_time);
    date.setUTCHours(date.getUTCHours() + 8);
    this.at_scene_time = date;
    this.latitude = incident.latitude;
    this.longitude = incident.longitude;
    this.initial_type_subgroup = incident.initial_type_subgroup;
    this.hundred_block_location = incident.hundred_block_location;
    this.initial_type_description = incident.initial_type_description;
    this.zip = policeData.getZip(incident);
  };

  policeData.allIncidents = [];


  policeData.renderTable = function(data) {
    var source = $('#data-table-template').html();
    var template = Handlebars.compile(source);
    return template(data);
  };

  policeData.getZip = function(incident){
    var latlng = incident.latitude + ',' + incident.longitude;

    var zippy;
    $.ajax({
      url:'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&result_type=street_address&key=' + gMapsToken,
      async:false,
      success:function(data) {
        try {
          zippy = data.results[0].address_components[7].short_name;
        } catch(Exception) {
          console.log('an error occured fetching zipcode', Exception);
        }
      }
    });

    return zippy;
  };

  policeData.loadData = function(inputData){
    policeData.allIncidents = inputData.map(function(elem,idx,array){
      return new policeData(elem);
    });
    policeDataView.renderPage(policeData.allIncidents);
    policeDataView.populateFilters();
  };

  policeData.callSeattle = function(){
    //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
    //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
    var twelveHoursAgo = new Date(Date.now()-(20*60*60*1000)).toISOString();
    $.get('https://data.seattle.gov/resource/3k2p-39jp.json?$where=at_scene_time>"' + twelveHoursAgo + '"', function(data,msg,xhr){
      var lastMod = xhr.getResponseHeader('Last-Modified');
      localStorage.setItem('lastMod', lastMod);
      localStorage.setItem('allIncidents', JSON.stringify(data));
      policeData.loadData(data);
      policeData.buildDatabase();
    });
  };


  policeData.clearDB = function(){
    webDB.execute(
      'DROP TABLE crimes'
    );
  };

  policeData.fetchData = function(){
    if(!localStorage.lastMod){
      policeData.callSeattle();
    } else {
      var twelveHoursAgo = new Date(Date.now()-(20*60*60*1000)).toISOString();
      $.get('https://data.seattle.gov/resource/3k2p-39jp.json?$where=at_scene_time>"' + twelveHoursAgo + '"',
         function(data,msg,xhr){
           if(localStorage.lastMod === xhr.getResponseHeader('Last-Modified')){
            //do nothing
             console.log('the last mods were the same');
             policeData.loadData(JSON.parse(localStorage.allIncidents));
           } else {
             policeData.callSeattle();
             console.log('the last mods were not the same');
           }
         });
    }
  };

  policeData.fillDB = function(){
    policeData.allIncidents.forEach(function(elem){
      elem.insertRecord();
    });
  };

  policeData.buildDatabase = function(){
    policeData.clearDB();
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS crimes(' +
      'id INTEGER PRIMARY KEY,' +
      'at_scene_time DATE,' +
      'hundred_block_location VARCHAR,' +
      'initial_type_subgroup VARCHAR,' +
      'initial_type_description VARCHAR,' +
      'zip VARCHAR(5),' +
      'longitude FLOAT,' +
      'latitude FLOAT);',
      console.log('successfully set up the table')
    );
    policeData.fillDB();
  };

  policeData.prototype.insertRecord = function(){
    webDB.execute(
      [{
        'sql': 'INSERT INTO crimes(at_scene_time, hundred_block_location, initial_type_subgroup, initial_type_description, zip, longitude, latitude) VALUES(?,?,?,?,?,?,?);',
        'data':[this.at_scene_time, this.hundred_block_location, this.initial_type_subgroup, this.initial_type_description, this.zip, this.longitude, this.latitude]
      }]
    );
  };

  policeData.findWhere = function(field, value, callback) {
    webDB.execute(
      [{
        sql: 'SELECT * FROM crimes WHERE ' + field + ' = ?' + 'ORDER BY at_scene_time DESC;',
        data: [value]
      }],
      callback
    );
  };

  policeData.crimeFilter = function() {
    return policeData.allIncidents.map(function(crimes) {
      return crimes.initial_type_subgroup;
    })
    .reduce(function(acc, cur) {
      if (acc.indexOf(cur) === -1) {
        acc.push(cur);
      }
      return acc;
    }, []);
  };

  module.policeData = policeData;
})(window);
