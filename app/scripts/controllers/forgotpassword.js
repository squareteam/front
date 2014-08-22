'use strict';

angular.module('squareteam.app')
  .controller('forgotPasswordCtrl', function ($scope, $stateParams, $http, $state, appConfig) {
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
          } else if (response.status === 400 && response.data && response.data.length && response.data[0] === 'api.oauth_account') {
            var provider = response.data[1].provider;
            $scope.oAuthAccountFound  = provider;
            $scope.oAuthLoginLink     = appConfig.api.oauth[provider].endpoint;
          } else {
            $scope.serverBusy = true;
          }
        });
      };
    }
  });
