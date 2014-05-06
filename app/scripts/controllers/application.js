'use strict';

angular.module('squareteam.app')
  .controller('ApplicationCtrl', function ($scope, ApiSession) {
    $scope.session = ApiSession;
  });
