page('/about',aboutmeDataController.reveal);
page('/crimedata',policeDataController.reveal);
page('/crime/:crimeType', policeDataController.loadByCrimeType, policeDataController.index);
page('/crime','/');
page('/', policeDataController.resetPage);
page('/zip/:zipcode', policeDataController.loadByZip, policeDataController.index);
page('/zip','/');
page();
