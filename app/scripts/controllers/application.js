'use strict';

// This is the master scope of application, first child of $rootScope
// Every scope (expect isolated ones) inherits from this one
// 
// ApplicationCtrl provide basic value and methods to the scope :
//  - logout
//  - session (class)
//  - current session
//  - app version
//  - $translate service

angular.module('squareteam.app')
  .controller('ApplicationCtrl', function ($rootScope, $scope, $state, $translate, ApiSession, CurrentSession, VERSION) {
    $scope.session          = ApiSession;
    $scope.currentSession   = CurrentSession;
    $scope.version          = VERSION;

    $scope.$translate       = $translate;

    $scope.logout = function() {
      ApiSession.logout().then(function() {
        $state.go('login');
      }.bind(this), function() {
        $state.go('app.home');
      }.bind(this));
    };
  });
