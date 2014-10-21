'use strict';

angular.module('squareteam.app')
.controller('LoginCtrl', function ($scope, $state, $injector, ApiOAuth) {

  ApiOAuth.redirectIfLogin();
  ApiOAuth.redirectIfEmailConfirmation();

});
