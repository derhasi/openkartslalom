
/**
 * Provides result object factory.
 */
openKS.factory('openKSResult', ['openKSDatabase', function openKSResultFactory(db) {

  /**
   * Result object for use in openKS.
   */
  var OpenKSResult = function() {

    this.startNo =  undefined;
    this.driverID = undefined;
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
    OpenKSUtilObj.call(this);
  }
  // Inherit OpenKSUtilObj.
  OpenKSResult.prototype = new OpenKSUtilObj();
  // Add our database connection to the prototype, so we can us it in static
  // functions too.
  OpenKSResult.prototype.__db = db.resultDB;
  // Correct the constructor pointer because it points to OpenKSUtilObj.
  OpenKSResult.prototype.constructor = OpenKSResult;

  /**
   * Copy static methods from OpenKSUtilObj.
   */
  OpenKSResult.load = OpenKSUtilObj.load;
  OpenKSResult.create = OpenKSUtilObj.create;
  OpenKSResult.loadAll = OpenKSUtilObj.loadAll;

  return OpenKSResult;
}]);
