'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, $location, Currentuser, ApiSession) {


    $scope.organizations = $scope.currentUser.getUser().organizations;


    $scope.logout = function() {
      ApiSession.logout().then(function() {
        $location.path('/login');
      }.bind(this), function() {
        $location.path('/home'); // FIXME ?
      }.bind(this));
    };
  });
