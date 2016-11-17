page('/map', mapsDataController.reveal);
page('/about',aboutmeDataController.reveal);
page('/crimedata',policeDataController.reveal);
page('/home', homeController.reveal);
page('/crime/:crimeType', policeDataController.loadByCrimeType, policeDataController.index);
//page('/crime','/');
page('/', policeData.loadData(policeData.allIncidents));
page('/zip/:zipcode', policeDataController.loadByZip, policeDataController.index);
page('/zip','/');

page();
