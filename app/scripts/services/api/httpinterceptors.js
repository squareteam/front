/*global $*/
'use strict';

angular.module('squareteam.api')
  .factory('ApiHttpInterceptors', function($q, ApiCrypto, ApiErrors, appConfig) {

    var apiProtocolRegex        = /^apis?:\/\//,
        apiSecureProtocolRegex  = /^apis:\/\//,
        apiResponseRegex        = new RegExp('^' + appConfig.api.url);


    function $$handleErrorResponse (response) {
      if (angular.isDefined(response.data) &&
          angular.isDefined(response.data.errors) &&
          response.data.errors.length) {
        response.error = new ApiErrors.Api(response.data.errors);
      } else {
        response.error = new ApiErrors.Http(response.status, response.data);
      }
    }

    return {
      request : function(config) {
        var isApiSecureCall = apiSecureProtocolRegex.test(config.url);

        if (apiProtocolRegex.test(config.url)) {
          config.url = config.url.replace(apiProtocolRegex, appConfig.api.url);

          if (isApiSecureCall) {
            config = ApiCrypto.transformRequest(config);
          }

          if (config.data) { // Compat with ST API
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            config.data = $.param(config.data);
          }
        }

        return config;
      },

      // TODO : Error classes ?
      // FIXME : tests !
      response : function(response) {
        if (apiResponseRegex.test(response.config.url)) {
          if (!response.data.errors && response.status <= 201) {
            response.data = response.data.data;
            return response;
          } else {
            $$handleErrorResponse(response);
            return $q.reject(response); // this is an error, reject promise.
          }
        } else {
          return response;
        }
      },

      responseError : function(response) {

        $$handleErrorResponse(response);

        return $q.reject(response);
      }
    };
  });
