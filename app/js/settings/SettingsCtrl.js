/**
 * Controller for settings view.
 */
openKS.controller('SettingsCtrl', [ '$scope', 'openKSNavigation', function($scope, navigation) {

  $scope.clearHistory = function() {
    navigation.clear();
  }

}]);
