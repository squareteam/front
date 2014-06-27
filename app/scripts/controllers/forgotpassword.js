'use strict';

angular.module('squareteam.app')
  .controller('forgotPasswordCtrl', function ($scope, $stateParams, $http, $state) {
    if ($stateParams.token) {
      $scope.change = function() {
        $http.post('api://forgotPassword/change', {
          token     : $stateParams.token,
          password  : $scope.user.password
        }).then(function() {
          $state.go('public.forgotPassword.changed');
        }, function() {
          $scope.serverBusy = true;
        });
      };
    } else {
      $scope.request = function() {
        $http.post('api://forgotPassword', {
          email  : $scope.user.email
        }).then(function() {
          $state.go('public.forgotPassword.request_sent');
        }, function() {
          // if 404 : Token expired, redirect to 'public.forgotPassword.request'
          $scope.serverBusy = true;
        });
      };
    }
  });
