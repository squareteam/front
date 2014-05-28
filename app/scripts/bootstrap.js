'use strict';

angular.module('squareteam.app').run(function($rootScope, $state) {

  // README:
  // 
  //  ACL is handled in states resolves, so when a promise is rejected with a object like :
  //     {
  //        redirectToState : <state:String>
  //     }
  //     
  //  Then this code snippet will redirect to asked state (without loop)
  $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {

    if (angular.isObject(error) && error.redirectToState && error.redirectToState !== to.name) {
      $state.go(error.redirectToState);
    }
  });

});
