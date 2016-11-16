  'use strict';
  (function(module) {



    var infoWindow = new google.maps.InfoWindow();

    var mapsDataView = {};

    mapsDataView.renderMaps = function (policeDataArray){
//    var jsonIncidents= JSON.stringify(policeData.allIncidents);
  // Creating a new map
      var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(47.6, -122.3),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      for (var i = 0, length = policeDataArray.length; i < length; i++) {
        var data = policeDataArray[i];
        var latLng = new google.maps.LatLng(data.latitude, data.longitude);

    // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'title!'
        });

        (function(marker, data) {

          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, 'click', function(e) {
            infoWindow.setContent(data.date_reported.toString() + '<br>' + data.summarized_offense_description);
            infoWindow.open(map, marker);
          });
        }) (marker, data);
      }
    };

    policeData.fetchData();
    module.mapsDataView = mapsDataView;
  }(window));
