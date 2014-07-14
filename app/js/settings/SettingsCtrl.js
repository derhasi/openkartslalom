/**
 * Controller for settings view.
 */
openKS.controller('SettingsCtrl', [ '$scope', 'openKSNavHistory', function($scope, history) {

  $scope.clearHistory = function() {
    history.clearHistory();
  }

}]);
