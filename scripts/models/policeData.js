(function(module) {
  'use strict';
  var policeData = {};

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
    console.log(policeData.allIncidents.filter(function(elem,idx){
      return idx<10;
    }));
  };

  policeData.fetchData = function(next){
    var timeNow = Date.now();
    //The Date object accounts for time zone but the Seattle Dataset does not.  An extra 8 hours need to be
    //subtracted in order to make up for the time difference.  Here, 20 hours are subtracted to go back 12 hours.
    var twelveHoursAgo = new Date(timeNow-(20*60*60*1000)).toISOString();
    console.log(new Date(timeNow));
    console.log(twelveHoursAgo);
    $.get('https://data.seattle.gov/resource/teu6-p2zn.json?$where=date_reported>"'+twelveHoursAgo+'"', function(data,msg,xhr){
      //console.log(data);
      //console.log(new policeData(data[0]));
      console.log(data);
      policeData.loadData(data);
    });
    next();
  };


  policeData.buildDatabase = function(){

  };


  policeData.fetchData();

  module.policeData = policeData;
}(window));
