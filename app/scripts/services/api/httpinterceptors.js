/*global $*/
'use strict';

// Handle API specific behaviour for Requests and Responses
// 
// ## Request
// 
//  All $http request starting with `api://` will be replace be API url
//  If request url is `apis://` (notice the "s" for secure), then ApiCrypto
//  will be called on request to add Authentification Headers
//  
// ## Response
// 
//  API Responses are like this : 
//  
//    {
//      "errors" : <Array|Null>,
//      "data"   : <Array|Null>
//    }
//    
//  This Service will return proper error by adding a property `error` to response
//  There is 2 types of Error :
//    - ApiErrors
//    - HttpError
//  (see ApiErrors for more informations)

angular.module('squareteam.api')
  .factory('ApiHttpInterceptors', function($q, $injector, $rootScope, ApiErrors, appConfig) {

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
        var ApiCrypto       = $injector.get('ApiCrypto'),
            isApiSecureCall = apiSecureProtocolRegex.test(config.url);

        $rootScope.loading = true;

        if (apiProtocolRegex.test(config.url)) {
          config.url = config.url.replace(apiProtocolRegex, appConfig.api.url);

          if (isApiSecureCall) {
            config = ApiCrypto.transformRequest(config);
          }

        }

        return config;
      },

      response : function(response) {

        $rootScope.loading = false;

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

        $rootScope.loading = false;

        $$handleErrorResponse(response);

        return $q.reject(response);
      }
    };
  });
