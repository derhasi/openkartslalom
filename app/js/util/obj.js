'use strict';

/**
 * Basic object to write and load from IDBStore.
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
  var obj = this;
  this.__db.get(id,
    // Success callback
    function(item) {
      // We initialise the object with the retrieved item.
      obj.init(item);

      callback(obj);
    },
    // Error callback.
    function (err) {
      callback(this, err);
    }
  );
}

/**
 * Asynchronous save function.
 *
 * @param {Function} callback
 *   - will be called with (updated) driver object as first parameter
 */
OpenKSUtilObj.prototype.save = function (callback) {
  var store = this.toObject();
  var obj = this;
  this.__db.put(store,
    // Success callback providing (new) id.
    function(id) {
      obj.id = id;
      callback(obj);
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
 *
 */
OpenKSUtilObj.prototype.delete = function (callback) {
  var obj = this.toObject();
  console.log('Delete obj:', obj);

  this.__db.remove(this.id,
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
 * Load object for the given class from the database.
 *
 * @param {OpenKSUtilObj} OpenKSClass
 * @param {int} id
 * @param {Function} callback
 * @returns {OpenKSUtilObj}
 */
OpenKSUtilObj.load = function (id, callback) {
  var obj = new this();
  obj.load(id, callback);
  return obj;
}

/**
 * Create a new driver object from a given set of parameters.
 *
 * @param {{}} params
 *   Parameters to create the new Driver object.
 *   May not hold 'id', as that should be used with load() to avoid unforeseen
 *   behavior.
 *
 * @returns {OpenKSUtilObj}
 *   A new driver object.
 */
OpenKSUtilObj.create = function(params) {
  var obj = new this();
  // make sure no id is set.
  params.id = undefined;
  obj.init(params);
  return obj;
}

/**
 * Load all objects for the given db.
 *
 * @param {Function} callback
 */
OpenKSUtilObj.loadAll = function(callback) {
  // We us the database given by the prototype.
  if (this.prototype.__db == undefined) {
    console.log('Error', 'No __db provided');
  }

  // Provide our class in our scope.
  var objClass = this;

  this.prototype.__db.getAll(
    function(items) {
      console.log(items);
      var objs = [];

      // Build a new object for every databse row.
      for (var i in items) {
        var obj = new objClass();
        obj.init(items[i]);
        objs.push(obj);
      }

      callback(objs);
    },
    function (err) {
      console.log('Error', err);
    }
  );
}
