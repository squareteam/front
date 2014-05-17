'use strict';

angular.module('squareteam.app')
  .controller('ApplicationCtrl', function ($rootScope, $scope, $state, ApiSession, Currentuser, VERSION) {
    $scope.session      = ApiSession;
    $scope.currentUser  = Currentuser;
    $scope.version      = VERSION;

    $scope.logout = function() {
      ApiSession.logout().then(function() {
        $state.go('login');
      }.bind(this), function() {
        $state.go('app.home');
      }.bind(this));
    };
  });
