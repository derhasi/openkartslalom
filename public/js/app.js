'use strict';


// Declare app level module which depends on filters, and services
var openKS = angular.module('openKS', ['ngResource', 'openKS.filters', 'openKS.services', 'openKS.directives']);

openKS.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  // Routes defined.
  $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: HomeCtrl});
  $routeProvider.when('/drivers', {templateUrl: 'views/drivers.html', controller: driversCtrl});
  $routeProvider.when('/drivers/add', {templateUrl: 'views/driver-form.html', controller: driversAddCtrl});
  $routeProvider.when('/drivers/:id/edit', {templateUrl: 'views/driver-form.html', controller: driversEditCtrl});
  $routeProvider.when('/settings', {templateUrl: 'views/settings.html', controller: settingsCtrl});
  $routeProvider.when('/results', {templateUrl: 'views/results.html', controller: resultsCtrl});
  $routeProvider.when('/results/add', {templateUrl: 'views/result-form.html', controller: resultsAddCtrl});
  $routeProvider.when('/results/:id/edit', {templateUrl: 'views/result-form.html', controller: resultsEditCtrl});
  $routeProvider.otherwise({redirectTo: '/home'});
  $locationProvider.html5Mode(true);

}]);

// @todo minify support?
openKS.factory('configFactory', function($resource) {
  return $resource('/api/config',
    {},
    { save: { method: 'PUT' }}
  );
});

/**
 * Factory for accessing driver data.
 */
openKS.factory('driverFactory', function($resource) {
  return $resource('/api/driver/:driverId',
    { driverId: '@__id' },
    {
      save: { method: 'PUT' },
      new: {method: 'GET', params:{driverId:"new"}}
    }
  );
});

/**
 * Factory for accessing driver data.
 */
openKS.factory('resultFactory', function($resource) {
  return $resource('/api/result/:id',
    { id: '@id' },
    {
      query: {method: 'GET', params:{id:'query'}, isArray: true},
      save: { method: 'PUT' },
      new: {method: 'GET', params:{id:"new"}}
    }
  );
});
