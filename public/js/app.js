'use strict';


// Declare app level module which depends on filters, and services
angular.module('openKS', ['openKS.filters', 'openKS.services', 'openKS.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home', controller: HomeCtrl});
    $routeProvider.when('/drivers', {templateUrl: 'partials/drivers', controller: driversCtrl});
    $routeProvider.when('/settings', {templateUrl: 'partials/settings', controller: settingsCtrl});
    $routeProvider.otherwise({redirectTo: '/home'});
    $locationProvider.html5Mode(true);
  }]);
