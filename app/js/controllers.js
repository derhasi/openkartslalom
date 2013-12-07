'use strict';

/* Controllers */

/**
 * Controller for the whole html content.
 */
openKS.controller('AppCtrl', ['$scope', function($scope) {
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
    info: { name: 'info', url: 'views/info.html'}

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
openKS.controller('DriversCtrl', [function() {}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('ResultsCtrl', [function() {}]);

/**
 * Controller for drivers overview.
 */
openKS.controller('SettingsCtrl', [function() {}]);
