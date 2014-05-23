'use strict';

angular.module('squareteam.app')
.controller('LoginCtrl', function ($scope, $cookies, $location, $state, ApiSession, appConfig) {
  var login = $location.search() && $location.search().email;
  $scope.login = login || '';
  $scope.oauthAuthenticating = false;

  if ($cookies[appConfig.api.oauth.cookieNS]) {
    // if (!login) {
    //   // ask email to continue
    // }
    $scope.oauthAuthenticating = true;
    ApiSession.login(login, $cookies[appConfig.api.oauth.cookieNS]).then(function() {
      delete $cookies[appConfig.api.oauth.cookieNS];
      $state.go('app.home');
    }); // FIXME : set a flash message if failure
  }
});
