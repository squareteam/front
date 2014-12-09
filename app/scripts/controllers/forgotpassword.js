'use strict';

angular.module('squareteam.app')
  .controller('forgotPasswordCtrl', function ($scope, $stateParams, $http, $state, appConfig, ApiErrors, stPolicies) {
    if ($stateParams.token) {
      $scope.passwordFormat = function() {
        $scope.passwordBadPractice = !stPolicies.isPasswordValid($scope.user.password);
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
          } else if (response.error && response.error instanceof ApiErrors.Api && response.error.getErrors()[0] === 'api.oauth_account') {
            var provider = response.error.getErrors()[1].provider;
            $scope.oAuthAccountFound  = provider;
            $scope.oAuthLoginLink     = appConfig.api.oauth[provider].endpoint;
          } else {
            $scope.serverBusy = true;
          }
        });
      };
    }
  });
