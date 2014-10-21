'use strict';

// OAuth controller

angular.module('squareteam.api')
  .factory('ApiOAuth', function Apiauth($location, $cookies, $q, ApiSession, appConfig) {
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
        var provider = $location.search() && $location.search().provider;

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
        var params = $location.search(), emailParams = params && params['errors[email][]'], missingEmail = false;
        console.warn(emailParams);
        angular.forEach(emailParams, function(v) {
          missingEmail = missingEmail || v === 'api.missing_attribute';
        }, params);
        return  params &&
                params.provider &&
                missingEmail;
      },

      providerConfig : function(provider) {

        return appConfig.api.oauth[provider];

      }

    };
  });
