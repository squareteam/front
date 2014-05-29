/*global CryptoJS*/
'use strict';

// This Service provide methods to
//
//  - login given a identifier (email) and a password
//  - logout
//
//

angular.module('squareteam.api')
  .service('ApiSession', function Apisession($rootScope, $http, $q, appConfig, CurrentSession, ApiSessionStorageCookies, ApiAuth, ApiCrypto, ApiErrors) {

    this.login = function(login, password) {
      var deferred        = $q.defer(),
          authToValidate  = new ApiAuth();


      function $$login () {
        $http.put('api://login', {
          identifier : login
        }).then(function(response) {
          if (response && response.data &&
              response.data.salt1 && response.data.salt1.length > 0 &&
              response.data.salt2 && response.data.salt2.length > 0) {

            authToValidate.identifier = login;
            authToValidate.token      = ApiCrypto.generateToken(
                                          login,
                                          password,
                                          CryptoJS.enc.Hex.parse(response.data.salt1),
                                          CryptoJS.enc.Hex.parse(response.data.salt2)
                                        );

            CurrentSession.register(authToValidate).then(function() {
              CurrentSession.save();
              deferred.resolve();
            }, function(error) {
              if (error === 'auth.invalid') {
                deferred.reject('auth.bad_password');
              } else {
                deferred.reject('api.not_available');
              }
            });
          } else {
            deferred.reject('api.response_malformed');
          }
        }, function(response) {
          if (response.error instanceof ApiErrors.Http) {
            deferred.reject('api.not_available');
          } else {
            deferred.reject('auth.bad_login');
          }
        });
      }

      if (CurrentSession.isAuthenticated()) {
        this.logout().then($$login, deferred.reject);
      } else {
        $$login();
      }

      return deferred.promise;
    };

    this.logout = function(destroyFromStorageToo) {
      var deferred = $q.defer();

      destroyFromStorageToo = angular.isDefined(destroyFromStorageToo) ? destroyFromStorageToo : true;

      if (CurrentSession.isAuthenticated()) {
        $http.get('apis://logout').then(function() {
          // success
          if (destroyFromStorageToo) {
            ApiSessionStorageCookies.destroy();
          }
          CurrentSession.unregister();
          deferred.resolve();
        }, function() {
          deferred.reject('api.not_available');
        });
      } else {
        deferred.reject('session.invalid');
      }
      
      return deferred.promise;
    };

  });
