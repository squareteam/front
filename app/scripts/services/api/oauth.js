'use strict';

// OAuth controller

angular.module('squareteam.api')
  .factory('ApiOAuth', function Apiauth($location, $cookies, $q, ApiSession, appConfig, u2camelFilter) {
    return {

      redirectIfLogin : function() {

        if (this.isOAuthLoginRequest()) {
          $location.path('/oauth/check');
        }

      },

      redirectIfEmailConfirmation : function() {

        if (this.isOAuthEmailMissingRequest()) {
          $location.path('/oauth/email');
        }

      },

      // Helpers

      isOAuthLoginRequest : function() {
        var provider = $location.search() && u2camelFilter($location.search().provider);

        return  provider &&
                $location.search() && $location.search().email &&
                $cookies[appConfig.api.oauth.cookieNS] && appConfig.api.oauth[provider];
      },

      oAuthLoginData : function() {
        return {
          provider : $location.search().provider,
          email    : $location.search().email,
          tmpKey   : $cookies[appConfig.api.oauth.cookieNS]
        };
      },

      login : function() {
        var deferred = $q.defer(),
            oAuthLoginData;

        if (this.isOAuthLoginRequest()) {
          oAuthLoginData = this.oAuthLoginData();

          ApiSession.login(oAuthLoginData.email, oAuthLoginData.tmpKey).then(function() {
            delete $cookies[appConfig.api.oauth.cookieNS];
            deferred.resolve();
          }, deferred.reject);

        } else {
          deferred.reject('oauth.params_missing');
        }

        return deferred.promise;
      },

      isOAuthEmailMissingRequest : function() {
        var params = $location.search();
        return  params &&
                params['errors[email][]'] &&
                params['errors[email][]'].indexOf('api.missing_attribute') >= 0 &&
                params.provider;
      },

      providerConfig : function(provider) {

        return appConfig.api.oauth[u2camelFilter(provider)];

      }

    };
  });
