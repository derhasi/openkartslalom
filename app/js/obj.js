
/**
 * Provides an object factory.
 *
 * @param {{}} params
 *   Properties for initialising the object.
 */

/**
 *
 * @constructor
 */
function OpenKSUtilObj() {
  // Every object has to hold that ID, as this is used to store the object.
  this.id = undefined;

  // Extract defaults and init the object properties.
  this.defaults();
  this.init({});
}

/**
 * Extract the default values from initial object.
 */
OpenKSUtilObj.prototype.defaults = function() {

  // We get the defaults from the already existing
  // properties.
  this.__defaults = {};

  // Extract defaults.
  for (var key in this) {
    // We got a default, if it is not a function and the property is not
    // prefixed with an underscore.
    if (key[0] != '_' && typeof this[key] != 'function') {
      this.__defaults[key] = this[key];
    }
  }
};

/**
 * Initialize the object with the given parameters
 *
 * @param {{}} params
 *   Properties for initialising the object.
 */
OpenKSUtilObj.prototype.init = function (params) {
  console.log('init typeof params', typeof params);
  if (params === undefined || typeof params != 'object') {
    return;
  }

  var defaults = this.__defaults;

  // Assign passed values to the object. Set default, if none is given.
  for (var prop in defaults) {
    this[prop] = (params[prop] !== undefined) ? params[prop] : defaults[prop];
  }
};

/**
 * Provides a simple object, that contains all defined fields.
 *
 * @returns {{}}
 *   The fields are
 */
OpenKSUtilObj.prototype.toObject = function() {
  var defaults = this.__defaults;

  var obj = {};
  for (var prop in defaults) {
    // We do not set 'id', so it is not part of the object and may not cause
    // errors with IndexDB. Otherwise the following error might occur:
    // "Evaluating the object store's key path yielded a value that is not a valid key"
    if (prop != 'id' || this[prop] !== undefined) {
      obj[prop] = this[prop];
    }
  }
  return obj;
};

/**
 * Checks if the current object is new.
 *
 * @returns {boolean}
 *   true if the object is new. false otherwise.
 */
OpenKSUtilObj.prototype.isNew = function() {
  return this.id == undefined || this.id <= 0;
};

/**
 * Loads the object parameters from the database.
 *
 * @param {int} id
 * @param {Function} callback
 */
OpenKSUtilObj.prototype.load = function(id, callback) {
  return;
  this.__db.get(id,
    // Success callback
    function(item) {
      // We initialise the object with the retrieved item.
      this.init(item)

      callback(this);
    },
    // Error callback.
    function (err) {
      callback(this, err);
    }
  );
}

/**
 * Result object for use in openKS.
 *
 * @param {{}} params
 *   Parameters for initialising the object.
 */
function OpenKSResult(params, id, callback) {

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

  // Call the parent constructor
  OpenKSUtilObj.call(this, params, id, callback);
}
// Inherit OpenKSUtilObj.
OpenKSResult.prototype = new OpenKSUtilObj();
// Correct the constructor pointer because it points to OpenKSUtilObj.
OpenKSResult.prototype.constructor = OpenKSResult;

/**
 * Driver object for use in openKS.
 *
 * @param {{}} params
 *   Parameters for initialising the object.
 */
function OpenKSDriver(params, id, callback) {
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

  // Provide datastore for our object.
  this.__dbready = false;
  this.__db = new mockDB(function() {
    this.__dbready = true;
  });

  // Call the parent constructor
  OpenKSUtilObj.call(this, params, id, callback);
}
// Inherit OpenKSUtilObj.
OpenKSDriver.prototype = new OpenKSUtilObj();
// Correct the constructor pointer because it points to OpenKSUtilObj.
OpenKSDriver.prototype.constructor = OpenKSDriver;

/**
 * A simple mockDB for now.
 * @param options
 */
var mockDB = function(options) {

  var onStoreReady = (options.onStoreReady == undefined) ? function(){} : options.onStoreReady;

  this.get = function(id, callback) {
    setTimeout(function() {
      callback({id: id, comment: 'This comment ' + +new Date()});
    }, 1000);
  };

  this.put = function(obj, callback) {
    setTimeout(function() {
      if (obj.id == undefined) {
        obj.id = +new Date();
      }

      callback(obj.id);
    });
  }

  // Simulate database initialisation.
  setTimeout(function() {
    onStoreReady();
  }, 1000);
}
