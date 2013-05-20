'use strict';

/* Controllers */

/**
 * Controller for drivers overview.
 *
 * @param $scope
 * @param $http
 */
function driversCtrl($scope, $http) {
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
