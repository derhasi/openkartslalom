
( function() {

  var nav = angular.module('openKS.nav');

  /**
   * Service providing the general navigation object.
   */
  nav.factory('openKSNavHistory', function() {

    function NavHistoryModel() {

      var self = this;

      this.history = [];
      this.current = undefined;
      this.future = [];

      /**
       * Add an item to the history as current element.
       *
       * @param item
       * @returns {NavHistoryModel}
       */
      this.add = function(item) {
        if (self.current != undefined) {
          var lastItem = self.current;
          self.history.push(lastItem);
        }
        self.current = item;
        return self;
      }

      /**
       * Set the current element back in history.
       *
       * @returns {NavHistoryModel}
       */
      this.undo = function() {
        if (!self.hasHistory()) {
          return self;
        }

        // Add the current item to the future, if some exists.
        if (self.current != undefined) {
          var lastItem = self.current;
          self.future.push(lastItem);
        }

        var pastItem = self.history.pop();
        self.current = pastItem;
        return self;
      }

      /**
       * Set the current element to the future.
       *
       * @returns {NavHistoryModel}
       */
      this.redo = function() {
        if (!self.hasFuture()) {
          return self;
        }

        if (self.current != undefined) {
          var lastItem = self.current;
          self.history.push(lastItem);
        }

        var futureItem = self.future.pop();
        self.current = futureItem;
        return self;
      }

      /**
       * Check if we got items in the history.
       *
       * @returns {boolean}
       */
      this.hasHistory = function() {
        return self.history.length > 0;
      }

      /**
       * Check if the history item has future items.
       *
       * @returns {boolean}
       */
      this.hasFuture = function(){
        return self.future.length > 0;
      }

      /**
       * Clears history and future items.
       *
       * @returns {NavHistoryModel}
       */
      this.clear = function() {
        self.history = [];
        self.future = [];
        return self;
      }
    }


    return new NavHistoryModel();
  });
})();

