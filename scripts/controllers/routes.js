page('/map', mapsDataController.reveal);
page('/about',aboutmeDataController.reveal);
page('/crimedata',policeDataController.reveal);
page('/home', homeController.reveal);
page('/crime/:crimeType', policeDataController.loadByCrimeType, policeDataController.index);
page('/crime','/');
page();
