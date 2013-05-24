'use strict';


// Declare app level module which depends on filters, and services
var openKS = angular.module('openKS', ['ngResource', 'openKS.filters', 'openKS.services', 'openKS.directives', 'pascalprecht.translate']);

openKS.config(['$routeProvider', '$locationProvider', '$translateProvider', function($routeProvider, $locationProvider, $translateProvider) {
  // Routes defined.
  $routeProvider.when('/home', {templateUrl: 'partials/home', controller: HomeCtrl});
  $routeProvider.when('/drivers', {templateUrl: 'partials/drivers', controller: driversCtrl});
  $routeProvider.when('/drivers/add', {templateUrl: 'partials/driver-form', controller: driversAddCtrl});
  $routeProvider.when('/drivers/:id/edit', {templateUrl: 'partials/driver-form', controller: driversEditCtrl});
  $routeProvider.when('/settings', {templateUrl: 'partials/settings', controller: settingsCtrl});
  $routeProvider.otherwise({redirectTo: '/home'});
  $locationProvider.html5Mode(true);

  // Configure translation service.
  $translateProvider.preferredLanguage('de');

  // use static-files loader with options object
  $translateProvider.useStaticFilesLoader({
    prefix: 'translations/',
    suffix: '.json'
  });

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
