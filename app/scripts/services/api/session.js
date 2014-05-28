/*global CryptoJS*/
'use strict';

// This Service provide methods to
// 
//  - login given a identifier (email) and a password
//  - logout
//  - save CurrentSession for persistence
//  - restore CurrentSession from cookies
//  
//  
// TODO(charly): move save and restore to CurrentSession
// TODO(charly): remove `isAuthenticated` method

angular.module('squareteam.api')
  .service('ApiSession', function Apisession($rootScope, $http, $q, appConfig, CurrentSession, ApiSessionStorageCookies, ApiAuth, ApiCrypto, ApiErrors) {

    this.isAuthenticated = function() {
      return CurrentSession.isAuthenticated();
    };

    this.login = function(login, password) {
      var deferred        = $q.defer(),
          authToValidate  = new ApiAuth(),
          self            = this;


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

            CurrentSession.$register(authToValidate).then(function() {
              self.save();
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

      if (this.isAuthenticated()) {
        this.logout().then($$login, deferred.reject);
      } else {
        $$login();
      }

      return deferred.promise;
    };

    this.logout = function(destroyFromStorageToo) {
      var deferred = $q.defer(),
          self     = this;

      destroyFromStorageToo = angular.isDefined(destroyFromStorageToo) ? destroyFromStorageToo : true;

      if (this.isAuthenticated()) {
        $http.get('apis://logout').then(function() {
          // success
          if (destroyFromStorageToo) {
            ApiSessionStorageCookies.destroy();
          }
          CurrentSession.$unregister();
          deferred.resolve();
        }, function() {
          deferred.reject('api.not_available');
        });
      } else {
        deferred.reject('session.invalid');
      }
      
      return deferred.promise;
    };

    this.save = function() {

      var deferred = $q.defer();

      if (this.isAuthenticated()) {
        if (ApiSessionStorageCookies.store(CurrentSession.getAuth())) {
          deferred.resolve();
        } else {
          deferred.reject('session.storage.unable_to_store');
        }
      } else {
        deferred.reject('session.invalid');
      }
      
      return deferred.promise;

    };

    this.restore = function() {
      var deferred  = $q.defer(),
          auth      = ApiSessionStorageCookies.retrieve();

      if (auth) {
        CurrentSession.$register(auth).then(function() {
          deferred.resolve();
        }, function(error) {
          // remove invalid auth from cookies
          ApiSessionStorageCookies.destroy();
          deferred.resolve(error);
        });
      } else {
        deferred.resolve('session.storage.no_session');
      }

      return deferred.promise;
    };

  });
