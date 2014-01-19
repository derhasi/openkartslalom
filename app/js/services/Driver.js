'use strict';

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

    // Call the parent constructor
    OpenKSUtilObj.call(this);
  }
  // Inherit OpenKSUtilObj.
  OpenKSDriver.prototype = new OpenKSUtilObj();
  // Add our database connection to the prototype, so we can us it in static
  // functions too.
  OpenKSDriver.prototype.__db = db.driverDB;

  // Correct the constructor pointer because it points to OpenKSUtilObj.
  OpenKSDriver.prototype.constructor = OpenKSDriver;

  OpenKSDriver.prototype.getPreview = function() {
    var output = '';
    output += this.license;
    output += ' - ' + this.firstname + ' ' + this.lastname;
    output += ' (' + this.zipcode + ' ' + this.city + ')';
    output += ' - Class: ' + this.class;
    output += ' - Birthday: ' +  this.birthday;
    output += ' - Club: ' + this.club;
    return output;
  }

  /**
   * Copy static methods from OpenKSUtilObj.
   */
  OpenKSDriver.load = OpenKSUtilObj.load;
  OpenKSDriver.create = OpenKSUtilObj.create;
  OpenKSDriver.loadAll = OpenKSUtilObj.loadAll;

  return OpenKSDriver;
}]);
