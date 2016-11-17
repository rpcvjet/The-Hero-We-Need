(function(module) {
  'use strict';

  function policeData(incident){
    this.date_reported=new Date(incident.date_reported);
    // this.location = {lat: incident.location.latitude, lon:incident.location.longitude};
    this.latitude = incident.latitude;
    this.longitude = incident.longitude;
    this.offense_type=incident.offense_type;
    this.summarized_offense_description=incident.summarized_offense_description;
    this.zip=policeData.getZip(incident);
  };

  policeData.allIncidents = [];


  policeData.renderTable = function(data) {
    var source = $('#data-table-template').html();
    var template = Handlebars.compile(source);
    return template(data);
  };

  policeData.getZip=function(incident){
    var latlng=incident.latitude+','+incident.longitude;
    var zippy;
    $.ajax({
      url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlng+'&result_type=street_address&key='+gMapsToken,
      async:false,
      success:function(data){
        zippy=data.results[0].address_components[7].short_name;
      }
    });
    return zippy;
  };

  policeData.loadData = function(inputData){
    policeData.allIncidents=inputData.map(function(elem,idx,array){
      return new policeData(elem);
    });
    policeDataView.renderPage(policeData.allIncidents);
    policeDataView.populateFilters();
  };

  policeData.callSeattle = function(){
    //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
    //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
    var twelveHoursAgo = new Date(Date.now()-(20*60*60*1000)).toISOString();
    $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"', function(data,msg,xhr){
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
    }else{
      var twelveHoursAgo = new Date(Date.now()-(20*60*60*1000)).toISOString();
      $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"',
         function(data,msg,xhr){
           if(localStorage.lastMod===xhr.getResponseHeader('Last-Modified')){
            //do nothing
             console.log('the last mods were the same');
             policeData.loadData(JSON.parse(localStorage.allIncidents));
           }else{
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
      'CREATE TABLE IF NOT EXISTS crimes('+
      'id INTEGER PRIMARY KEY,'+
      'date_reported DATE,'+
      'summarized_offense_description VARCHAR,'+
      'zip VARCHAR(5),'+
      'longitude FLOAT,'+
      'latitude FLOAT);',
      console.log('successfully set up the table')
    );
    policeData.fillDB();
  };

  policeData.prototype.insertRecord = function(){
    webDB.execute(
      [{
        'sql': 'INSERT INTO crimes(date_reported, summarized_offense_description, zip, longitude, latitude) VALUES(?,?,?,?,?);',
        'data':[this.date_reported, this.summarized_offense_description, this.zip, this.longitude, this.latitude]
      }]
    );
  };

  policeData.findWhere = function(field, value, callback) {
    console.log(value);
    webDB.execute(
      [{
        sql: 'SELECT * FROM crimes WHERE ' + field + ' = ?;',
        data: [value]
      }],
      callback
    );
  };

  policeData.crimeFilter = function() {
    return policeData.allIncidents.map(function(crimes) {
      return crimes.summarized_offense_description;
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
