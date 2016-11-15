(function(module) {
  'use strict';

  function policeData(incident){
    this.date_reported=new Date(incident.date_reported);
    this.location = {lat: incident.location.latitude, lon:incident.location.longitude};
    this.offense_type=incident.offense_type;
    this.summarized_offense_description=incident.summarized_offense_description;
    this.zip=policeData.getZip(incident);
  };

  policeData.allIncidents = [];

  policeData.prototype.renderTable = function() {
    console.log('RUN RENDER');
    var source = $('#data-table-template').html();
    var template = Handlebars.compile(source);
    return template(this);
  };

  policeData.getZip=function(incident){
    var latlng=incident.location.latitude+','+incident.location.longitude;
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
    policeData.allIncidents.map(function(data){
      $('#police-data').append(data.renderTable());
    });
  };

  policeData.callSeattle = function(){
    //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
    //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
    var twelveHoursAgo = new Date(Date.now()-(20*60*60*1000)).toISOString();
    $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"', function(data,msg,xhr){
      var lastMod = xhr.getResponseHeader('Last-Modified');
      console.log(data);
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
    console.log(policeData.allIncidents);
    policeData.allIncidents.forEach(function(elem){
      elem.insertRecord();
    });
  };

  policeData.buildDatabase = function(){
    policeData.clearDB();
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS crimes('+
      'id INTEGER PRIMARY KEY,'+
      'date DATE,'+
      'crime_type VARCHAR,'+
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
        'sql': 'INSERT INTO crimes(date, crime_type, zip, longitude, latitude) VALUES(?,?,?,?,?);',
        'data':[this.date_reported, this.summarized_offense_description, this.zip, this.location.longitude, this.location.latitude]
      }]
    );
  };


  policeData.fetchData();

  module.policeData = policeData;
})(window);
