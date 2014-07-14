

/**
 * Controller for result overview.
 */
openKS.controller('ResultsCtrl', ['$scope', 'openKSResult', 'openKSNavState', function($scope, openKSResult, nav) {
  $scope.loading = true;

  $scope.results = [];

  /**
   * Loads the all drivers asynchronously.
   */
  $scope.loadResults = function() {
    // We mark the scope, that we are loading the drivers list again.
    $scope.loading = true;

    openKSResult.loadAll(
      function(results) {
        // Assign the fetched result items to our scope variable.
        $scope.results = results;
        // As we finished, we can unflag the loading state.
        $scope.loading = false;
        // ... as the call is async, we need to tell our scope that it has been
        // updated.
        $scope.$apply();
      }
    );
  }

  // Initially load the results on controller init.
  $scope.loadResults();

  /**
   * Wrapper for navigating to the edit view of the given entry.
   *
   * @param id
   */
  $scope.editView = function (id) {
    nav.setView('resultEdit', {id: id});
  }

}]);
