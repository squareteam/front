'use strict';

angular.module('squareteam.app')
  .controller('forgotPasswordCtrl', function ($scope, $stateParams, $http, $state) {
    if ($stateParams.token) {
      $scope.passwordFormat = function() {
        $scope.passwordBadPractice = !$scope.user.password || $scope.user.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) === null;
      };

      $scope.change = function() {
        $http.post('api://forgot_password/change', {
          token     : $stateParams.token,
          password  : $scope.user.password
        }).then(function() {
          $state.go('public.forgotPassword.changed');
        }, function(response) {
          if (response.status === 404) {
            $scope.tokenInvalid = true;
          } else {
            $scope.serverBusy = true;
          }
        });
      };
    } else {
      $scope.request = function() {
        $http.post('api://forgot_password', {
          email  : $scope.user.email
        }).then(function() {
          $state.go('public.forgotPassword.request_sent');
        }, function(response) {
          if (response.status === 404) {
            $scope.emailInvalid = true;
          } else {
            $scope.serverBusy = true;
          }
        });
      };
    }
  });
