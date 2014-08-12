/*global CryptoJS*/
'use strict';

// Store ApiAuth in cookies for persistence

angular.module('squareteam.api')
  .service('ApiSessionStorageCookies', function ApiSessionStorageCookies($cookies, ApiAuth, appConfig) {

    this.store =  function(apiAuth) {
      if (apiAuth.$isValid()) {
        $cookies[appConfig.api.storageNS] = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse([apiAuth.identifier, apiAuth.token.toString()].join(':')));
      } else {
        return false;
      }
    };

    this.retrieve = function() {
      if (!this.empty()) {
        var rawSession = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse($cookies[appConfig.api.storageNS])).split(':');
        if (rawSession.length === 2) {
          return new ApiAuth(rawSession[0], CryptoJS.enc.Hex.parse(rawSession[1]));
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    this.destroy = function() {
      delete $cookies[appConfig.api.storageNS];
    };

    this.empty = function() {
      return angular.isUndefined($cookies[appConfig.api.storageNS]);
    };

  });
