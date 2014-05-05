'use strict';

angular.module('squareteam.app').run(function($rootScope, $location, ApiSession) {
  ApiSession.restore().then(function(errorIfAny) {
    if (errorIfAny && errorIfAny === 'auth.invalid') {
      // redirect to login page with flash message
    }
  });

  // TODO : find a way to prevent routing before Session restore

  $rootScope.$on('$routeChangeStart', function(evt, next) {
    // If no rules, route is protected by default

    if (((typeof next.$$route === 'undefined' || typeof next.$$route.anonymous === 'undefined') && ApiSession.isAnonymous()) ||
          typeof next.$$route !== 'undefined' && !next.$$route.anonymous && ApiSession.isAnonymous()) {
      $location.path('/login');
    // If authenticated can't access, redirect to /home
    } else if (typeof next.$$route !== 'undefined' && next.$$route.anonymous && !ApiSession.isAnonymous()) {

      $location.path('/home');

    }
  });
});