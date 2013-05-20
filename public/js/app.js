'use strict';


// Declare app level module which depends on filters, and services
var openKS = angular.module('openKS', ['ngResource', 'openKS.filters', 'openKS.services', 'openKS.directives']);

openKS.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home', controller: HomeCtrl});
  $routeProvider.when('/drivers', {templateUrl: 'partials/drivers', controller: driversCtrl});
  $routeProvider.when('/settings', {templateUrl: 'partials/settings', controller: settingsCtrl});
  $routeProvider.otherwise({redirectTo: '/home'});
  $locationProvider.html5Mode(true);
}]);

// @todo minify support?
openKS.factory('configFactory', function($resource) {
  return $resource('/api/config',
    {},
    { update: { method: 'PUT' }}
  );
});
