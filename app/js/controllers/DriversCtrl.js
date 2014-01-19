'use strict';

/**
 * Controller for drivers overview.
 */
openKS.controller('DriversCtrl', ['$scope', 'openKSDriver', 'openKSNavigation', function($scope, openKSDriver, nav) {
  $scope.loading = true;

  $scope.drivers = [];

  /**
   * Loads the all drivers asynchronously.
   */
  $scope.loadDrivers = function() {
    // We mark the scope, that we are loading the drivers list again.
    $scope.loading = true;

    openKSDriver.loadAll(
      function(drivers) {
        // Assign the fetched drivers to our scope variable.
        $scope.drivers = drivers;
        // As we finished, we can unflag the loading state.
        $scope.loading = false;
        // ... as the call is async, we need to tell our scope that it has been
        // updated.
        $scope.$apply();
      }
    );
  }

  // Initially load the drivers on controller init.
  $scope.loadDrivers();

  /**
   * Wrapper for navigating to the edit view of the given entry.
   *
   * @param id
   */
  $scope.editView = function (id) {
    nav.setView('driverEdit', [id], function () {
      $scope.$apply();
    });
  }

}]);
