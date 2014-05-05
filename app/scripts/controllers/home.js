'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, $location, Currentuser, ApiSession) {
    $scope.name = Currentuser.getUser().name;

    $scope.logout = function() {
      ApiSession.logout().then(function() {
        $location.path('/login');
      }.bind(this), function() {
        $location.path('/home'); // FIXME ?
      }.bind(this));
    };
  });
