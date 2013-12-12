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

/**
 * Service providing the general navigation object.
 */
openKS.factory('openKSNavigation', function openKSNavigationFactory() {
  var views = [
    {
      key: 'home',
      title: 'Home',
      url: 'views/home.html',
      iconClass: 'fa fa-home'
    },
    { key: 'results',
      title: 'Results',
      url: 'views/results.html',
      parent: 'home',
      iconClass: 'fa fa-trophy'
    },
    {
      key: 'drivers',
      title: 'Drivers',
      url: 'views/drivers.html',
      parent: 'home',
      iconClass: 'fa fa-users'
    },
    {
      key: 'settings',
      title: 'Settings',
      url: 'views/settings.html',
      parent: 'home',
      iconClass: 'fa fa-cog'
    },
    {
      key: 'info',
      title: 'Info',
      url: 'views/info.html',
      parent: 'home',
      iconClass: 'fa fa-info'
    },
    {
      key: 'driverAdd',
      title: 'Add driver',
      url: 'views/driver-form.html',
      parent: 'drivers',
      iconClass: 'fa fa-plus'
    },
    {
      key: 'driverEdit',
      title: 'Edit driver',
      url: 'views/driver-form.html',
      parent: 'drivers',
      iconClass: 'fa fa-edit'
    },
    {
      key: 'resultAdd',
      title: 'Add result',
      url: 'views/result-form.html',
      parent: 'results',
      iconClass: 'fa fa-clock-o'
    },
    {
      key: 'resultEdit',
      title: 'Edit result',
      url: 'views/result-form.html',
      parent: 'results',
      iconClass: 'fa fa-edit'
    }
  ];

  var nav = new openKSUtil.navObject(views, 'index');
  return nav;
});

/**
 * Provides driver object.
 */
openKS.factory('openKSDriver', ['openKSDatabase', function openKSDriverFactory(db) {
  var openKSDriver = function (params) {

    // Driver for internal reference.
    var driver = this;

    // Empty params, means empty object.
    if (params == undefined) {
      params = {};
    }

    // Default values for a new driver.
    this.isNew = function () {
      return driver.id == undefined || driver.id <= 0;
    };

    // Init default params (will be overwritten by init() again).
    this.id = undefined;
    this.license = '';
    this.club = '';
    this.class = '';
    this.firstname = '';
    this.lastname = '';
    this.zipcode = '';
    this.city = '';
    this.sex = '';
    this.birthday = '';
    this.oldLicense = '';
    this.rookie = '';
    this.comment = '';

    /**
     * Construct the object from the given parameters provided.
     * @param {Array} params
     */
    var init = function (params) {
      assign(driver, params, true);
    }

    /**
     * Private function to assig properties to a given object.
     *
     * @param {Object} obj
     * @param {Object} params
     */
    var assign = function (obj, params, addUndefined) {
      var defaults = {
        id: undefined,
        firstname: '',
        lastname: '',
        zipcode: '',
        city: '',
        license: '',
        class: '',
        club: '',
        sex: '',
        birthday: '',
        oldLicense: '',
        rookie: '',
        comment: ''
      }

      // Assign passed values to the object. Set default, if none is given.
      for (var prop in defaults) {
        var val = (params[prop] != undefined) ? params[prop] : defaults[prop];
        if (val != undefined || addUndefined) {
          obj[prop] = val;
        }
      }
    }

    /**
     * Asynchronous save function.
     *
     * @param {Function} callback
     *  - will be called with (updated) driver object as first parameter
     */
    this.save = function (callback) {
      var store = driver.toObject();
      db.driverDB.put(store,
        // Success callback providing (new) id.
        function(id) {
          driver.id = id;
          callback(driver);
        },
        // Error callback.
        function (err) {
          console.error(err);
        }
      );
    }

    /**
     * Delete the driver instance.
     *
     * @param {Function} callback
     */
    this.delete = function (callback) {
      var obj = driver.toObject();
      console.log('Delete driver:', obj);

      db.driverDB.remove(driver.id,
        // Success function.
        function () {
          callback(obj);
        },
        // Error callback.
        function (err) {
          console.error(err);
        }
      );
    }

    /**
     * Provide an object that can be stored to the indexedDB.
     *
     * For some reason the original object cannot be serialized, so we simply
     * take the raw values.
     *
     * @returns {{}}
     */
    this.toObject = function() {
      var obj = {};
      // The assign function with the false indicator will remove undefined
      // values, so the id of new objects is not part of the object and may not
      // cause errors with IndexDB.
      // Due to that I had been running in the error:
      // "Evaluating the object store's key path yielded a value that is not a valid key"
      assign(obj, driver, false);
      return obj;
    }

    // Initialize the object, after we got it.
    init(params);
  };

  /**
   * Load a new driver by id from the db.
   *
   * @param {int} driverID
   * @param {Function} callback
   *   - will be called with new driver object as first parameter
   */
  openKSDriver.load = function(driverID, callback) {
    db.driverDB.get(driverID,
      // Success callback
      function(item) {
        var newDriver = new openKSDriver(item);
        callback(newDriver);
      },
      // Error callback.
      function (err) {
        console.log('Error', err);
      }
    );
  }

  return openKSDriver;
}]);
