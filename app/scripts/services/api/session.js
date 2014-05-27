/*global CryptoJS*/
'use strict';

angular.module('squareteam.api')
  .service('ApiSession', function Apisession($rootScope, $http, $q, appConfig, Currentuser, ApiSessionStorageCookies, ApiAuth, ApiCrypto, ApiErrors) {

    this.isAuthenticated = function() {
      return Currentuser.isAuthenticated();
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

            self.$register(authToValidate).then(function() {
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
          self.$unregister();
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
        if (ApiSessionStorageCookies.store(Currentuser.getAuth())) {
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
        this.$register(auth).then(function() {
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

    this.$unregister = function() {
      Currentuser.setAuth(new ApiAuth());
      Currentuser.setUser(null);
      $rootScope.$broadcast('user:disconnected');
    };

    this.$register = function(auth) {
      var deferred = $q.defer();

      $http({
        method  : 'GET',
        url     : appConfig.api.url + 'user/me',
        // FIXME : Use $httpProvider.defaults.headers.common instead
        headers : angular.extend({'X-Requested-With': 'XMLHttpRequest'}, ApiCrypto.generateHeaders(auth, appConfig.api.url + 'user/me', 'GET', {}))
      }).then(function(response) {
        Currentuser.setAuth(auth, true);
        Currentuser.setUser(response.data);
        $rootScope.$broadcast('user:connected');
        deferred.resolve(response.data);
      }, function(response) {
        if (response.error instanceof ApiErrors.Http) {
          deferred.reject('api.not_available');
        } else {
          deferred.reject('auth.invalid');
        }
      });
      
      return deferred.promise;
    };
  });
