
( function() {

  var nav = angular.module('openKS.nav');

  /**
   * Service providing navigation wrapper for the state object.
   */
  nav.factory('openKSNavState', ['$state', function($state) {

    /**
     *
     * @constructor
     */
    function NavState() {

      /**
       * Changes the state of the navigation.
       *
       * @param name
       * @param params
       */
      this.setView = function(name, params) {
        $state.go(name, params);
      }
    }


    return new NavState();
  }]);
})();

