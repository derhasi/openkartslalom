'use strict';

/* Controllers */

/**
 * Controller for the whole html content.
 *
 * @param $scope
 * @param $location
 * @constructor
 */
function AppCtrl($scope, $location) {
  $scope.getClass = function(path) {
    if ($location.path().indexOf(path) == 0) {
      return "active";
    }
    else {
      return "";
    }
  }
}
AppCtrl.$inject = ['$scope', '$location'];


/**
 * Controller for drivers overview.
 *
 * @param $scope
 * @param $http
 */
function driversCtrl($scope, $http) {
  $scope.drivers = [];

  $http({method: 'GET', url: '/api/drivers'}).
    success(function(data, status, headers, config) {
      $scope.drivers = data;
      console.log($scope.drivers);
    }).
    error(function(data, status, headers, config) {
      $scope.drivers = [];
    });
}
driversCtrl.$inject = ['$scope', '$http'];


function HomeCtrl() {
}
HomeCtrl.$inject = [];


/**
 * Controller for settings page.
 */
function settingsCtrl() {

}
settingsCtrl.$inject = [];

