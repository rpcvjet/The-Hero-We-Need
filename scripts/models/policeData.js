(function(module) {
  'use strict';

  function policeData(incident){
    this.date_reported=new Date(incident.date_reported);
    this.location = incident.location;
    this.offense_type=incident.offense_type;
    this.summarized_offense_description=incident.summarized_offense_description;
    this.zip=policeData.getZip(incident);
  };

  policeData.allIncidents = [];

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
      if(idx<10){
        return new policeData(elem);
      }
    });

    policeData.buildDatabase();

    console.log(policeData.allIncidents.filter(function(elem,idx){
      return idx<10;
    }));
  };

  policeData.callSeattle = function(){
    var timeNow = Date.now();
    //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
    //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
    var twelveHoursAgo = new Date(timeNow-(20*60*60*1000)).toISOString();
    console.log(new Date(timeNow));
    console.log(twelveHoursAgo);
    $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"', function(data,msg,xhr){
      //console.log(data);
      //console.log(new policeData(data[0]));
      var lastMod = xhr.getResponseHeader('Last-Modified');
      localStorage.lastMod=lastMod;
      console.log('I was modified on '+lastMod);
      console.log(data);
      policeData.loadData(data);
    });
  };


  policeData.fetchData = function(){

    if(!localStorage.lastMod){
      policeData.callSeattle();
    }else{
      var timeNow = Date.now();
      //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
      //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
      var twelveHoursAgo = new Date(timeNow-(20*60*60*1000)).toISOString();
      console.log(new Date(timeNow));
      console.log(twelveHoursAgo);
      $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"',
         function(data,msg,xhr){
           var lastMod = xhr.getResponseHeader('Last-Modified');
           if(lastMod===localStorage.lastMod){
            //do nothing
           }else{
             policeData.callSeattle();
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
