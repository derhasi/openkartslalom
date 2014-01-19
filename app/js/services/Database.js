'use strict';

define(['bower/idbwrapper/idbstore'] , function (openKS, IDBStore) {

  /**
   * Provides the central database for storing drivers and (later) results data.
   */
  openKS.factory('openKSDatabase', function openKSDatabaseFactory() {

    var dbInitted = 0;

    // Provides data store for drivers.
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

    // Adds data store for results.
    var resultDB = new IDBStore({
      storeName: 'results',
      storePrefix: 'openKS-',
      dbVersion: 1,
      keyPath: 'id',
      autoIncrement: true,
      onStoreReady: function(){
        dbInitted++;
      },
      indexes: [
        { name: 'driverID' },
        { name: 'status' }
      ]
    });

    return {
      "driverDB": driverDB,
      "resultDB": resultDB,
      "dbReady": function () {
        return dbInitted >= 2;
      }
    };
  });

});
