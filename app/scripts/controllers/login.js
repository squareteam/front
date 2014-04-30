'use strict';

angular.module('squareteam.app')
  .controller('LoginCtrl', function ($scope, ApiSession) {
    $scope.session = ApiSession;
  });
