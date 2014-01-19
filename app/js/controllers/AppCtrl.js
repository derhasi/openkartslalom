'use strict';

define(['openKS', 'services/Database', 'services/Navigation'] , function (openKS) {

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
      // Home shall only be active if is the current view and not only part of the
      // trail.
      if ($scope.nav.isActive(key) || ( key != 'home' && $scope.nav.isActiveTrail(key))) {
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

});
