
/**
 * Provides an object factory.
 *
 * @param {{}} params
 *   Properties for initialising the object.
 */
function OpenKSUtilObj(params) {
  // Every object has to hold that ID, as this is used to store the object.
  this.id = undefined;

  // Extract defaults and init the object properties.
  this.defaults();
  this.init(params);
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
}

/**
 * Result object for use in openKS.
 *
 * @param {{}} params
 *   Parameters for initialising the object.
 */
function OpenKSResult(params) {

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
  OpenKSUtilObj.call(this, params);
}
OpenKSResult.prototype = new OpenKSUtilObj();

/**
 * Driver object for use in openKS.
 *
 * @param {{}} params
 *   Parameters for initialising the object.
 */
function OpenKSDriver(params) {
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

  // Call the parent constructor
  OpenKSUtilObj.call(this, params);
}
OpenKSDriver.prototype = new OpenKSUtilObj();
