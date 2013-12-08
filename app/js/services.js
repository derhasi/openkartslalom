'use strict';

/**
 * @file
 * Holds custom services for the openKS app.
 */

/**
 * Provides the central database for storing drivers and (later) results data.
 */
openKS.factory('openKSDatabase', function openKSDatabaseFactory() {

  var dbInitted = 0;

  var driverDB = new IDBStore({
    storeName: 'drivers',
    storePrefix: 'openKS-',
    dbVersion: 1,
    keyPath: 'id',
    autoIncrement: true,
    onStoreReady: function(){
      dbInitted++;
    },
    indexes: [
      { name: 'class' },
      { name: 'firstname' },
      { name: 'lastname' },
      { name: 'club' }
    ]
  });

  return {
    "driverDB": driverDB,
    "dbReady": function () {
      return dbInitted >= 1;
    }
  };
});

/**
 * Service providing the general navigation object.
 */
openKS.factory('openKSNavigation', function openKSNavigationFactory() {
  var views = [
    { key: 'home', title: 'Home', url: 'views/home.html'},
    { key: 'results', title: 'Results', url: 'views/results.html'},
    { key: 'drivers', title: 'Drivers', url: 'views/drivers.html'},
    { key: 'settings', title: 'Settings', url: 'views/settings.html'},
    { key: 'info', title: 'Info', url: 'views/info.html'},
    { key: 'driverAdd', title: 'Add driver', url: 'views/driver-form.html'}
  ];

  var nav = new openKSUtil.navObject(views, 'index');
  return nav;
});
