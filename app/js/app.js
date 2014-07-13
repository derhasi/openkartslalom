'use strict';

// Declare app level module which depends on filters, and services
var openKS = angular.module('openKS', [
  'ui.bootstrap', 'ui.router', 'openKS.nav', 'openKS.home'
]);

// Some basic configuration for our app.
openKS.config(function($stateProvider) {

  // For making ui-view work, we use the stateProvider. As we are in a chrome
  // packaged App, we cannot use a URL or location provider.
  $stateProvider
    .state('home', {
      templateUrl: 'views/home.html',
      data: {
        title: 'Home',
        iconClass: "fa fa-home"
      }
    })
    .state('results', {
      templateUrl: 'views/results.html',
      data: {
        title: 'Results',
        iconClass: "fa fa-trophy",
        breadcrumbParent: 'home'
      }
    })
    .state('drivers', {
      templateUrl: 'views/drivers.html',
      data: {
        title: 'Drivers',
        iconClass: "fa fa-users",
        breadcrumbParent: 'home'
      }
    })
    .state('settings', {
      templateUrl: 'views/settings.html',
      data: {
        title: 'Settings',
        breadcrumbParent: 'home',
        iconClass: 'fa fa-cog'
      }
    })
    .state('info', {
      templateUrl: 'views/info.html',
      data: {
        title: 'Info',
        breadcrumbParent: 'home',
        iconClass: 'fa fa-info'
      }
    })
    .state('driverAdd', {
      templateUrl: 'views/driver-form.html',
      controller: 'DriverFormCtrl',
      resolve: {
        driverId: function() {
          return 0;
        }
      },
      data: {
        title: 'Add driver',
        breadcrumbParent: 'drivers',
        iconClass: 'fa fa-plus'
      }
    })
    .state('driverEdit', {
      templateUrl: 'views/driver-form.html',
      controller: 'DriverFormCtrl',
      params: ['id'],
      resolve: {
        driverId: function($stateParams) {
          console.log($stateParams);
          return parseInt($stateParams.id);
        }
      },
      data: {
        title: 'Edit driver',
        breadcrumbParent: 'drivers',
        iconClass: 'fa fa-edit'
      }
    })
    .state('resultAdd', {
      templateUrl: 'views/result-form.html',
      controller: 'ResultFormCtrl',
      resolve: {
        resultId: function() {
          return 0;
        }
      },
      data: {
        title: 'Add result',
        breadcrumbParent: 'results',
        iconClass: 'fa fa-clock-o'
      }
    })
    .state('resultEdit', {
      templateUrl: 'views/result-form.html',
      controller: 'ResultFormCtrl',
      params: ['id'],
      resolve: {
        resultId: function($stateParams) {
          return parseInt($stateParams.id);
        }
      },
      data: {
        title: 'Edit result',
        breadcrumbParent: 'results',
        iconClass: 'fa fa-edit'
      }
    })
    .state('timing', {
      templateUrl: 'views/timing.html',
      data: {
        title: 'Timing',
        breadcrumbParent: 'home',
        iconClass: 'fa fa-clock-o'
      }
    });


});
