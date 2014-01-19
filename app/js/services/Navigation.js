'use strict';

define(['openKS', 'util/nav'] , function (openKS, openKSUtilNav) {

  /**
   * Service providing the general navigation object.
   */
  openKS.factory('openKSNavigation', function openKSNavigationFactory() {
    var views = [
      {
        key: 'home',
        title: 'Home',
        url: 'views/home.html',
        iconClass: 'fa fa-home'
      },
      { key: 'results',
        title: 'Results',
        url: 'views/results.html',
        parent: 'home',
        iconClass: 'fa fa-trophy'
      },
      {
        key: 'drivers',
        title: 'Drivers',
        url: 'views/drivers.html',
        parent: 'home',
        iconClass: 'fa fa-users'
      },
      {
        key: 'settings',
        title: 'Settings',
        url: 'views/settings.html',
        parent: 'home',
        iconClass: 'fa fa-cog'
      },
      {
        key: 'info',
        title: 'Info',
        url: 'views/info.html',
        parent: 'home',
        iconClass: 'fa fa-info'
      },
      {
        key: 'driverAdd',
        title: 'Add driver',
        url: 'views/driver-form.html',
        parent: 'drivers',
        iconClass: 'fa fa-plus'
      },
      {
        key: 'driverEdit',
        title: 'Edit driver',
        url: 'views/driver-form.html',
        parent: 'drivers',
        iconClass: 'fa fa-edit'
      },
      {
        key: 'resultAdd',
        title: 'Add result',
        url: 'views/result-form.html',
        parent: 'results',
        iconClass: 'fa fa-clock-o'
      },
      {
        key: 'resultEdit',
        title: 'Edit result',
        url: 'views/result-form.html',
        parent: 'results',
        iconClass: 'fa fa-edit'
      },
      {
        key: 'timing',
        title: 'Timing',
        url: 'views/timing.html',
        parent: 'home',
        iconClass: 'fa fa-clock-o'
      }
    ];

    var nav = new openKSUtilNav(views, 'index');
    return nav;
  });

});
