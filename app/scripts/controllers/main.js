'use strict';

angular.module('squareteam.app')
  .controller('MainCtrl', function ($scope, ApiSession) {
    $scope.session = ApiSession;
  });
