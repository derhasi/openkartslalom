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
function driversCtrl($scope, $http) {
  $scope.drivers = [];

  $http({method: 'GET', url: '/api/drivers'}).
    success(function(data, status, headers, config) {
      $scope.drivers = data;
    }).
    error(function(data, status, headers, config) {
      $scope.drivers = [];
    });
}
driversCtrl.$inject = ['$scope', '$http'];

/**
 * Controller for editing driver.
 * @param $scope
 */
function driversEditCtrl($scope, $routeParams, driverFactory) {
  console.log($routeParams);
  $scope.driver = driverFactory.get({driverId: $routeParams.id});

  $scope.saveDriver = function() {
    $scope.driver.$save();
  }
}
driversEditCtrl.$inject = ['$scope', '$routeParams', 'driverFactory'];

/**
 * Controller for adding a driver.
 * @param $scope
 */
function driversAddCtrl($scope, $routeParams, driverFactory) {
  console.log($routeParams);
  $scope.driver = driverFactory.new();
  $scope.newDriver = true;

  $scope.saveDriver = function() {
    $scope.driver.$save();
  }
}
driversEditCtrl.$inject = ['$scope', '$routeParams', 'driverFactory'];

/**
 * Controller for settings page.
 */
function settingsCtrl($scope, configFactory) {
  $scope.config = configFactory.get();
  $scope.saveConfig = function() {
    $scope.config.$save();
  }
}
settingsCtrl.$inject = ['$scope', 'configFactory'];

/**
 * Controller for result list page.
 */
function resultsCtrl($scope, resultFactory) {
  $scope.results = resultFactory.query();
}
resultsCtrl.$inject = ['$scope', 'resultFactory'];


/**
 * Controller for editing result.
 * @param $scope
 */
function resultsEditCtrl($scope, $routeParams, resultFactory) {
  console.log($routeParams);
  $scope.result = resultFactory.get({id: $routeParams.id});

  $scope.saveResult = function() {
    $scope.result.$save();
  }
}
resultsEditCtrl.$inject = ['$scope', '$routeParams', 'resultFactory'];

/**
 * Controller for adding a result.
 * @param $scope
 */
function resultsAddCtrl($scope, $routeParams, resultFactory) {
  console.log($routeParams);
  $scope.result = resultFactory.new();
  $scope.newResult = true;

  $scope.saveResult = function() {
    $scope.result.$save();
  }
}
resultsEditCtrl.$inject = ['$scope', '$routeParams', 'resultFactory'];
