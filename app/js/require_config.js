
require.config({
  baseUrl: '/js',
  paths: {
    'angular': '/components/angular',
    'bower': '/components',
    'ui.bootstrap': '/components/angular-bootstrap/ui.bootstrap.js',
    'ui.bootstrap.tpls': '/components/angular-bootstrap/ui.bootstrap-tpls.js'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'ui.bootstrap': { deps:['angular']},
    'ui.bootstrap.tpls': { deps: ['ui.boostrap']}
  }
});

require(['angular', 'app_config'] , function (angular) {
  angular.bootstrap(document , ['openKS']);
});
