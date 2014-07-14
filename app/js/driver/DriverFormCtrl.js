
/**
 * Controller for driver form.
 */
openKS.controller('DriverFormCtrl', ['$scope', 'openKSDriver', 'driverId', 'openKSNavState',
  function($scope, openKSDriver, driverId, nav) {

  // We got a new driver on the driverAdd view.
  if (!driverId) {
    $scope.driver = new openKSDriver();
  }
  // We got an existing driver and therefore have to retrieve the ID from the
  // navigation args.
  else {
    openKSDriver.load(driverId, function(driver) {
      $scope.driver = driver;
      $scope.$apply();
    });
  }

  /**
   * Helper to get the new state of the driver object.
   * @returns {*}
   */
  $scope.isNew = function() {
    if ($scope.driver != undefined) {
      return $scope.driver.isNew();
    }
  }

  /**
   * Callback to save the current driver credentials.
   */
  $scope.saveDriver = function() {
    // We have to know, if the driver was new, before we saved it.
    var isNew = $scope.driver.isNew();
    $scope.driver.save(function(driver) {
      $scope.driver = driver;

      // If the driver was new, we change the view.
      if (isNew) {
        nav.setView('driverEdit', {id: driver.id});
      }
      else {
        nav.setView('drivers', {});
      }
    });
  };

  /**
   * Delete the driver of the current view.
   */
  $scope.deleteDriver = function() {
    // We need a driver id for deleting the driver.
    if ($scope.driver.id < 1) {
      return;
    }

    $scope.driver.delete(function(driverObj) {
      // Change the view to the drivers list.
      nav.setView('drivers', {});
    });
  }

}]);
