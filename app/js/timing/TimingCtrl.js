'use strict';

/**
 * Controller for the timing sandbox.
 */
openKS.controller('TimingCtrl', ['$scope', function($scope) {

  $scope.data = [];
  $scope.ports = [];

  /**
   * Load ports from serial API.
   */
  derhasi.chromeSerial.getPorts(function(err, ports) {
    $scope.ports = ports;
    $scope.$apply();
  });

  $scope.cSerial = undefined;
  $scope.selectedPort = undefined;

  $scope.connect = function() {
    if ($scope.selectedPort != undefined) {
      var cSerial = new derhasi.chromeSerial($scope.selectedPort);
      cSerial.connect(
        function(err, serial) {
          $scope.cSerial = serial;
          $scope.$apply();
        }
      );
    }
    else {
      $scope.cSerial = undefined;
    }
  }

  $scope.disconnect = function() {
    if ($scope.cSerial != undefined) {
      $scope.cSerial.disconnect(
        function(err, serial) {
          $scope.cSerial = undefined;
          $scope.$apply();
        }
      );
    }
  }


  $scope.listen = function() {
    $scope.cSerial.listen(function(err, data) {
      console.log(data);
      $scope.data.push(data);
    });
  };


  $scope.unlisten = function() {
    $scope.cSerial.unlisten();
  }

}]);
