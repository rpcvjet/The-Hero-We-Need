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
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // --------- Grayscale Map Styling ---------- //
        styles: [{
          'featureType': 'water',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 17
          }]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 20
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 17
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 29
          }, {
            'weight': 0.2
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 18
          }]
        }, {
          'featureType': 'road.local',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 16
          }]
        }, {
          'featureType': 'poi',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 21
          }]
        }, {
          'elementType': 'labels.text.stroke',
          'stylers': [{
            'visibility': 'on'
          }, {
            'color': '#000000'
          }, {
            'lightness': 16
          }]
        }, {
          'elementType': 'labels.text.fill',
          'stylers': [{
            'saturation': 36
          }, {
            'color': '#000000'
          }, {
            'lightness': 40
          }]
        }, {
          'elementType': 'labels.icon',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'transit',
          'elementType': 'geometry',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 19
          }]
        }, {
          'featureType': 'administrative',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 20
          }]
        }, {
          'featureType': 'administrative',
          'elementType': 'geometry.stroke',
          'stylers': [{
            'color': '#000000'
          }, {
            'lightness': 17
          }, {
            'weight': 1.2
          }]
        }]
        // ------- End Grayscale Map Styling ------------ //
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
            infoWindow.setContent(data.at_scene_time.toString() +
            '<br>' +
            data.initial_type_description +
            '<br>' +
            data.zip
          );
            infoWindow.open(map, marker);
          });
        }) (marker, data);
      }
    };

    policeData.fetchData();
    module.mapsDataView = mapsDataView;
  }(window));
