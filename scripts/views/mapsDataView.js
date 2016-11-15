  'use strict';
(function(module) {

  var mapsDataView = {};
  mapsDataView.renderMaps = function (){
//    var jsonIncidents= JSON.stringify(policeData.allIncidents);
  // Creating a new map
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(47.6, -122.3),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });



    for (var i = 0, length = policeData.allIncidents.length; i < length; i++) {
      var data = policeData.allIncidents[i];
      console.log(policeData.allIncidents);
      console.log(data);
      var latLng = new google.maps.LatLng(data.location.lat, data.location.lon);

    // Creating a marker and putting it on the map
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: "title!"
      });
    }
  };

  policeData.fetchData();
  module.mapsDataView = mapsDataView;
}(window));
