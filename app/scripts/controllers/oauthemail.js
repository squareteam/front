'use strict';

angular.module('squareteam.app')
  .controller('OAuthEmailConfirmCtrl', function($scope, $state, $location, ApiOAuth, stUtils) {

    if (ApiOAuth.isOAuthEmailMissingRequest()) {

      var providerConfig    = ApiOAuth.providerConfig($location.search().provider),
          providerEndpoint  = providerConfig.endpoint;

      $scope.confirm = function() {
        if (providerEndpoint) {
          stUtils.redirect([
            providerEndpoint,
            '?email=',
            $scope.user.email
          ].join(''));
        } else {
          $scope.error = 'public.oauth.email.wrong_provider';
        }
      };

    } else {
      $state.go('public.login');
    }

  });