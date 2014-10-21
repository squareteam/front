'use strict';

angular.module('squareteam.app')
  .controller('OAuthLoginCtrl', function($scope, $state, ApiOAuth) {

    $scope.authenticating = false;
    $scope.error          = '';

    if (ApiOAuth.isOAuthLoginRequest()) {

      $scope.authenticating = true;
      $scope.login = ApiOAuth.oAuthLoginData().email;

      ApiOAuth.login().then(function() {
        $state.go('app.home');
      }, function(reason) {
        $scope.authenticating = false;
        if (reason === 'auth.bad_login' || reason === 'auth.bad_password') {
          $scope.error = 'public.oauth.login.authenticating_error';
        } else {
          $scope.error = 'api.serverBusy';
        }
      });
    } else {
      $state.go('public.login');
    }

  });