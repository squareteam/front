'use strict';

// When the application is loaded to /login?email=:email&provider=:provider
// The LoginCtrl will try to find a "st.oauth" cookies containing
// a temporary login token to be used as password

angular.module('squareteam.app')
.controller('LoginCtrl', function ($scope, $cookies, $location, $state, ApiSession, appConfig) {
  var login     = $location.search() && $location.search().email,
      provider  = $location.search() && $location.search().provider;

  $scope.login = login || '';
  $scope.oauthAuthenticating = false;

  if ($cookies[appConfig.api.oauth.cookieNS] && login && provider && appConfig.api.oauth[provider]) {
    $scope.oauthAuthenticating = true;
    ApiSession.login(login, $cookies[appConfig.api.oauth.cookieNS]).then(function() {
      delete $cookies[appConfig.api.oauth.cookieNS];
      $state.go('app.home');
    }, function(reason) {
      if (reason === 'auth.bad_login' || reason === 'auth.bad_password') {
        $scope.oauthAuthenticatingError = 'public.login.authenticating_error';
      } else {
        $scope.oauthAuthenticatingError = 'api.serverBusy';
      }
    });
  }
});
