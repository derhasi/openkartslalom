

/**
 * Controller for the result form.
 */
openKS.controller('ResultFormCtrl', ['$scope', 'openKSResult', 'openKSDriver', 'openKSNavigation', function($scope, openKSResult, openKSDriver, navigation) {

  // Provide a list of drivers for autocomplete selection.
  $scope.drivers = [];
  openKSDriver.loadAll(function(drivers) {
    $scope.drivers = drivers;
    $scope.$apply();
  });

  // Holds the currently selected driver object.
  $scope.selectedDriver = undefined;

  // Provide the label of the driver in the autocomplete and the input field.
  $scope.getDriverLabel = function(d) {
    if (d == undefined) {
      return '';
    }

    return '[' + d.license + '] ' + d.firstname + ' ' + d.lastname + ' (' + d.club + ')';
  }

  // We got a new driver on the driverAdd view.
  if (navigation.currentView.key == 'resultAdd') {
    $scope.resultItem = new openKSResult();
  }
  // We got an existing driver and therefore have to retrieve the ID from the
  // navigation args.
  else {
    var resultId = navigation.getCurrentArg(0);

    openKSResult.load(resultId, function(res) {
      $scope.resultItem = res;

      // When we got a driverID, we load the selected driver object.
      if (res.driverID != undefined) {
        openKSDriver.load(res.driverID, function(driver) {
          $scope.selectedDriver = driver;
          $scope.$apply();
        })
      }
      else {
        $scope.$apply();
      }
    });
  }

  // Getter callback for a new
  $scope.isNew = function() {
    if ($scope.resultItem != undefined) {
      return $scope.resultItem.isNew();
    }
  };

  $scope.saveResultItem = function () {
    $scope.resultItem.driverID = $scope.selectedDriver.id;
    $scope.resultItem.save(function() {
      // We have a different behavior for new entries.
      var isNew = $scope.resultItem.isNew();
      $scope.resultItem.save(function(resultItem) {
        $scope.resultItem = resultItem;

        // If the driver was new, we change the view.
        if (isNew) {
          navigation.setView('resultEdit', [resultItem.id], function() {
            $scope.$apply();
          });
        }
        else {
          navigation.setView('results', [], function() {
            $scope.$apply();
          });
        }
      });
    });
  };

  /**
   * Delete the driver of the current view.
   */
  $scope.deleteResultItem = function() {
    // We need a driver id for deleting the driver.
    if ($scope.resultItem.id < 1) {
      return;
    }

    $scope.resultItem.delete(function(resultObj) {
      // Change the view to the drivers list.
      navigation.setView('results', [], function() {
        $scope.$apply();
      });
    });
  }

}]);
