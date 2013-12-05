'use strict';

/* Controllers */

/**
 * Controller for the whole html content.
 *
 * @param $scope
 * @param $location
 * @constructor
 */
function AppCtrl($scope) {
  $scope.getClass = function(path) {
    if ($scope.view.name == path) {
      return "active";
    }
    else {
      return "";
    }
  }

  $scope.getController = function(p) {
    return templates[p].controller;
  }

  /**
   * Provide a page changing event.
   * @param path
   */
  $scope.setView = function(p) {
    $scope.view = templates[p];
  }

  var templates = {
    home: { name: 'home', url: 'views/home.html', controller: 'HomeCtrl'},
    drivers: { name: 'drivers', url: 'views/drivers.html', controller: 'driversCtrl'},
    settings: { name: 'settings', url: 'views/settings.html', controller: 'settingsCtrl'},
    results: { name: 'results', url: 'views/results.html', controller: 'resultsCtrl'}
  };

  $scope.view = templates.home;

}
AppCtrl.$inject = ['$scope'];

/**
 * Controller for the home page.
 */
function HomeCtrl() {
}
HomeCtrl.$inject = [];

/**
 * Controller for drivers overview.
 *
 * @param $scope
 * @param $http
 */
function driversCtrl($scope) {
  $scope.drivers = [];
  $scope.title = 'Drivers';
}
driversCtrl.$inject = ['$scope'];

/**
 * Controller for settings page.
 */
function settingsCtrl($scope) {
  $scope.title = 'Settings';
}
settingsCtrl.$inject = ['$scope'];

/**
 * Controller for result list page.
 */
function resultsCtrl($scope) {
  $scope.results = [];
  $scope.title = 'Results';
}
resultsCtrl.$inject = ['$scope'];

