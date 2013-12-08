'use strict';

/**
 * @file
 * Holds controllers for the openKS app.
 */

/**
 * Controller for the whole html content.
 */
openKS.controller('AppCtrl', ['$scope', '$timeout', 'openKSDatabase', function($scope, $timeout, db) {

  // Function to check the status of the db initialisation.
  var checkDB = function () {
    $scope.dbReady = db.dbReady();

    if ($scope.dbReady == false) {
      console.log('DB not ready');
      $timeout(checkDB);
    }
    else {
      console.log('Yeah, DB is ready!');
    }
  };

  // And finally check it.
  checkDB();

  $scope.getClass = function(path) {
    if ($scope.view.name == path) {
      return "active";
    }
    else {
      return "";
    }
  }

  /**
   * Provide a page changing event.
   * @param path
   */
  $scope.setView = function(p) {
    $scope.view = templates[p];
  }

  var templates = {
    home: { name: 'home', url: 'views/home.html'},
    results: { name: 'results', url: 'views/results.html'},
    drivers: { name: 'drivers', url: 'views/drivers.html'},
    settings: { name: 'settings', url: 'views/settings.html'},
    info: { name: 'info', url: 'views/info.html'},
    driverAdd: {name: 'driverAdd', url: 'views/driver-form.html'}
  };

  $scope.view = templates.home;

}]);

/**
 * Controller for home.
 */
openKS.controller('HomeCtrl', [function() {}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('DriversCtrl', ['$scope', 'openKSDatabase', function($scope, db) {
  $scope.loading = true;

  $scope.drivers = [];

  /**
   * Loads the all drivers asynchronously.
   */
  $scope.loadDrivers = function() {
    // We mark the scope, that we are loading the drivers list again.
    $scope.loading = true;

    db.driverDB.getAll(
      function(items) {
        console.log(items);
        // Asign the fetched values to our scope variable.
        $scope.drivers = items;
        // As we finished, we can unflad the loading state.
        $scope.loading = false;
        // ... as the call is async, we need to tell our scope that it has been
        // updated.
        $scope.$apply();
      },
      function (err) {
        console.log('Error', err);
      }
    );
  }

  // Initially load the drivers on controller init.
  $scope.loadDrivers();

}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('ResultsCtrl', [function() {}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('SettingsCtrl', [function() {}]);
