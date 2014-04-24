'use strict';

angular.module('squareteam.api')
  .factory('ApiHttpInterceptors', function(ApiCrypto, appConfig) {

    var apiProtocolRegex        = /^(api|apis):\/\//,
        apiSecureProtocolRegex  = /^(apis):\/\//;

    return {
      'request' : function(config) {
        var isApiSecureCall = apiSecureProtocolRegex.test(config.url);

        if (apiProtocolRegex.test(config.url)) {
          config.url = config.url.replace(apiProtocolRegex, appConfig.api.url);
          if (!isApiSecureCall) {
            return config;
          } else {
            return ApiCrypto.transformRequest(config);
          }
        } else {
          return config;
        }
      }
    };
  });
