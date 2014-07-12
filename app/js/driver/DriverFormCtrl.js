
/**
 * Controller for driver form.
 */
openKS.controller('DriverFormCtrl', ['$scope', 'openKSDriver', 'openKSNavigation', function($scope, openKSDriver, navigation) {

  // We got a new driver on the driverAdd view.
  if (navigation.currentView.key == 'driverAdd') {
    $scope.driver = new openKSDriver();
  }
  // We got an existing driver and therefore have to retrieve the ID from the
  // navigation args.
  else {
    var driverId = navigation.getCurrentArg(0);

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
        navigation.setView('driverEdit', [driver.id], function() {
          $scope.$apply();
        });
      }
      else {
        navigation.setView('drivers', [], function() {
          $scope.$apply();
        });
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
      navigation.setView('drivers', [], function() {
        $scope.$apply();
      });
    });
  }

}]);
