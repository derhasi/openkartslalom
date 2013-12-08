'use strict';

/**
 * @file
 * Holds controllers for the openKS app.
 */

/**
 * Controller for the whole html content.
 */
openKS.controller('AppCtrl', ['$scope', '$timeout', 'openKSDatabase', 'openKSNavigation', function($scope, $timeout, db, navigation) {

  // Function to check the status of the db initialisation.
  // @todo: rewrite as trigger on openKSDatabase
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

  // Provides a navigation object with history and (later) persistent storage.
  $scope.nav = navigation;

  // Load the scope nav element from local store.
  $scope.nav.load( function() {
    // Set the default page as home, as we have no current view.
    $scope.nav.setDefaultView('home');
    // Make sure our nav element updates in view.
    $scope.$apply();
  });

  /**
   * Get the class for the given view.
   *
   * @param {string} key
   *   Key of the view
   * @returns {string}
   *   Either 'active' for the current view or empty string.
   */
  $scope.getClass = function(key) {
    if ($scope.nav.currentView != undefined && $scope.nav.currentView.key == key) {
      return "active";
    }
    else {
      return "";
    }
  }

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
openKS.controller('SettingsCtrl', [ '$scope', 'openKSNavigation', function($scope, navigation) {

  $scope.clearHistory = function() {
    navigation.clear();
  }

}]);
