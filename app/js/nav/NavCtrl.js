/**
 * @file
 * Holding Controller for implementing the global navigation, e.g breadcrumbs.
 */

(function() {

  var nav = angular.module('openKS.nav');

  nav.controller('NavCtrl', ['$rootScope', '$state', '$scope', 'openKSNavHistory',
    function ($rootScope, $state, $scope, history) {

      var self = this;

      // We initialize navigation with our home screen.
      $state.go('home');

      /**
       * Provides a list of crumb items for the given state.
       */
      this.breadcrumbs = [];

      this.hasHistory = function() {
        return history.hasHistory();
      }

      this.hasFuture = function() {
        return history.hasFuture();
      }

      this.undo = function() {
        var item = history.undo().skipNext().current;
        $state.go(item.name, item.params);
      }

      this.redo = function() {
        var item = history.redo().skipNext().current;
        $state.go(item.name, item.params);
      }

      /**
       * Helper function to update the breadcrumbs for the nav controller.
       */
      function updateBreadcrumbs() {

        self.breadcrumbs = [];

        // If there is no state, we got no breadcrumbs.
        if ($state.current == undefined) {
          return;
        }

        // Get raw template for the current view.
        var state = $state.current;
        var crumb = {};

        // Get the parent of template, as long as no parent is given anymore.
        while (state.data != undefined) {

          crumb = {
            key: state.name,
            iconClass: state.data.iconClass,
            title: state.data.title
          };

          // We add the data to the breadcrumbs.
          self.breadcrumbs.unshift(crumb);

          // Prepare the next state.
          if (state.data.breadcrumbParent) {
            state = $state.get(state.data.breadcrumbParent);
          }
          else {
            break;
          }
        }
      }

      // Whenever the state changes, we update our breadcrumbs.
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams){

        var item = {
          name: toState.name,
          params: toParams
        }
        history.add(item);

        updateBreadcrumbs();
      });


    }]);
})();

