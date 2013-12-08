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
