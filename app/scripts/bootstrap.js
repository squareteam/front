'use strict';

angular.module('squareteam.app').run(function($rootScope, $state, $urlRouter, ApiSession) {
  
  var preventRoutingBeforeSessionLoaded = $rootScope.$on('$stateChangeStart', function(evt) { evt.preventDefault(); });

  function setupRoutingACL () {
    $rootScope.$on('$stateChangeStart', function(evt, next) {
      if ( (!next.data || !next.data.acl) && !ApiSession.isAuthenticated() ) {
        console.log('redirect to login (default)');
        evt.preventDefault();
        $state.go('login');
      } else if (next.data && next.data.acl['public'] === false  && !ApiSession.isAuthenticated() ) {
        console.log('redirect to login (public set to false)');
        evt.preventDefault();
        $state.go('login');
      }

    });
  }

  ApiSession.restore().then(function(errorIfAny) {
    if (errorIfAny && errorIfAny === 'auth.invalid') {
      // redirect to login page with flash message
    }
    preventRoutingBeforeSessionLoaded();
    setupRoutingACL();
    $urlRouter.sync();
  }.bind(this));

});