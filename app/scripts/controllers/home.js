'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, ApiSession) {
    $scope.session = ApiSession;
  });
