'use strict';

angular.module('squareteam.app')
  .controller('ApplicationCtrl', function ($scope, ApiSession, Currentuser) {
    $scope.session      = ApiSession;
    $scope.currentUser = Currentuser;
  });
