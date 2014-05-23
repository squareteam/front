'use strict';

angular.module('squareteam.app')
.controller('LoginCtrl', function ($scope, $cookies, $location, $state, ApiSession, appConfig) {
  var login = $location.search().login;
  $scope.login = login;

  if ($cookies['st.oauth_token']) {
    // if (!login) {
    //   // ask email to continue
    // }

    ApiSession.login(login, $cookies[appConfig.api.oauth.cookieNS]).then(function() {
      $state.go('app.home');
    }); // FIXME : set a flash message if failure
  }
});
