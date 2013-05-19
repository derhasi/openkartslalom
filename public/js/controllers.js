'use strict';

/* Controllers */

function PersonsCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/persons'}).
    success(function(data, status, headers, config) {
      $scope.persons = data;
    }).
    error(function(data, status, headers, config) {
      $scope.persons = [];
    });
}
PersonsCtrl.$inject = ['$scope', '$http'];


function HomeCtrl() {
}
HomeCtrl.$inject = [];