'use strict';

angular.module('squareteam.app').run(function($rootScope, $state) {

  // Handle redirection from resolves
  $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {

    if (angular.isObject(error) && error.redirectToState && error.redirectToState !== to.name) {
      $state.go(error.redirectToState);
    }
  });

});
