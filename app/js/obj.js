
/**
 * Provides an object factory.
 *
 * @param defaults
 * @param required
 */
function OpenKSUtilObj(params) {
  // Every object has to hold that ID, as this is used to store the object.
  this.id = undefined;

  // Init defaults.
  this.defaults();
  this.init(params);
}

/**
 * Extract the default values from the
 */
OpenKSUtilObj.prototype.defaults = function() {

  // We get the defaults from the already existing
  // properties.
  this.__defaults = {};

  // Extract defaults.
  for (var i in this) {
    // We got a default, if it is not a function
    // and the property is not prefixed with an underscore.
    if (i[0] != '_' && typeof this[i] != 'function') {
      this.__defaults[i] = this[i];
    }
  }

  // Defaults
  console.log('Defaults:', this.__defaults);
};

/**
 * Initialize the object with the given parameters
 * @param params
 */
OpenKSUtilObj.prototype.init = function (params) {
  console.log('typeof params', typeof params);
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
 *
 * @param params
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
 *
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
