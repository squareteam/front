'use strict';

angular.module('squareteam.app').run(function($rootScope, $location, ApiSession) {
  ApiSession.restore().then(function(errorIfAny) {
    if (errorIfAny && errorIfAny === 'auth.invalid') {
      // redirect to login page with flash message
    }
  });

  $rootScope.$on('$routeChangeStart', function(evt, next) {
    if (((typeof next.$$route === 'undefined' || typeof next.$$route.anonymous === 'undefined') && ApiSession.isAnonymous()) ||
          next.$$route.anonymous !== ApiSession.isAnonymous()) {
      $location.path('/login');
    }
  });
});