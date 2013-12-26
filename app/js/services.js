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

  var nav = new openKSUtilNav(views, 'index');
  return nav;
});

/**
 * Provides driver object.
 */
openKS.factory('openKSDriver', ['openKSDatabase', function openKSDriverFactory(db) {

  /**
   * Driver object for use in openKS.
   */
  var OpenKSDriver = function() {
    // Init default params.
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

    this.__db = db.driverDB;

    // Call the parent constructor
    OpenKSUtilObj.call(this);
  }
  // Inherit OpenKSUtilObj.
  OpenKSDriver.prototype = new OpenKSUtilObj();
  // Correct the constructor pointer because it points to OpenKSUtilObj.
  OpenKSDriver.prototype.constructor = OpenKSDriver;

  /**
   * Load driver from the database.
   *
   * @param {int} id
   * @param {function} callback
   * @returns {OpenKSDriver}
   */
  OpenKSDriver.load = function(id, callback) {
    var drv = new OpenKSDriver();
    drv.load(id, callback);
    return drv;
  }

  /**
   * Create a new driver object from a given set of parameters.
   *
   * @param {{}} params
   *   Parameters to create the new Driver object.
   *   May not hold 'id', as that should be used with load() to avoid unforeseen
   *   behavior.
   *
   * @returns {OpenKSDriver}
   *   A new driver object.
   */
  OpenKSDriver.create = function(params) {
    var drv = new OpenKSDriver();
    // make sure no id is set.
    params.id = undefined;
    drv.init(params);
    return drv;
  }

  return OpenKSDriver;
}]);

/**
 * Provides result object factory.
 */
openKS.factory('openKSResult', ['openKSDatabase', function openKSResultFactory(db) {

  /**
   * Result object for use in openKS.
   */
  var OpenKSResult = function() {

    this.startNo =  undefined;
    this.driverId = undefined;
    this.training = {
      pen1: 0,
      pen2: 0,
      time: "0.00"
    };
    this.run1 = {
      pen1: 0,
      pen2: 0,
      time: "0.00"
    };
    this.run2 = {
      pen1: 0,
      pen2: 0,
      time: "0.00"
    };
    this.status = '';
    this.comment = '';

    this.__db = db.resultDB;

    // Call the parent constructor
    OpenKSUtilObj.call(this);
  }
  // Inherit OpenKSUtilObj.
  OpenKSResult.prototype = new OpenKSUtilObj();
  // Correct the constructor pointer because it points to OpenKSUtilObj.
  OpenKSResult.prototype.constructor = OpenKSResult;

  return OpenKSResult;
}]);
