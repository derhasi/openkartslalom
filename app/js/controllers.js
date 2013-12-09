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

  // Retrieve the parent templates as breadcrumbs.
  $scope.breadcrumbs = function() {
    return navigation.getCurrentParents();
  }

  // Load the scope nav element from local store.
  $scope.nav.load( function() {
    // Set the default page as home, as we have no current view.
    $scope.nav.setDefaultView('home', function() {
      $scope.$apply();
    });

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

  /**
   * Callback to wrap the change of a view.
   * @param key
   */
  $scope.setView = function (key) {
    navigation.setView(key, [], function() {
      $scope.$apply();
    });
  }

}]);

/**
 * Controller for home.
 */
openKS.controller('HomeCtrl', [function() {}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('DriversCtrl', ['$scope', 'openKSDatabase', 'openKSNavigation', function($scope, db, nav) {
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

/**
 * Controller for driver form.
 */
openKS.controller('DriverFormCtrl', ['$scope', 'openKSDriver', 'openKSNavigation', function($scope, driverDB, navigation) {

  // We got a new driver on the driverAdd view.
  if (navigation.currentView.key == 'driverAdd') {
    $scope.driver = new driverDB({});
  }
  // We got an existing driver and therefore have to retrieve the ID from the
  // navigation args.
  else {
    var driverId = navigation.getCurrentArg(0);

    driverDB.load(driverId, function(driver) {
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
    // We have to knwo, if the driver was new, before we saved it.
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

}]);

/**
 * Controller for restult overview.
 */
openKS.controller('ResultsCtrl', [function() {}]);

/**
 * Controller for settings view.
 */
openKS.controller('SettingsCtrl', [ '$scope', 'openKSNavigation', function($scope, navigation) {

  $scope.clearHistory = function() {
    navigation.clear();
  }

}]);
