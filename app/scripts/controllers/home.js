'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, Currentuser) {
    $scope.name = Currentuser.getUser().name;
  });
