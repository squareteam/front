/*global CryptoJS*/
'use strict';

angular.module('squareteam.api')
  .service('ApiSession', function Apisession($rootScope, $http, $q, appConfig, Currentuser, ApiSessionStorageCookies, ApiAuth, ApiCrypto, ApiErrors) {

    this.$pristine = true;

    this.isAuthenticated = function() {
      return Currentuser.isAuthenticated();
    };

    this.login = function(login, password) {
      var deferred        = $q.defer(),
          authToValidate  = new ApiAuth(),
          self            = this;


      function $$login () {
        self.$pristine = false;
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

            self.ackAuth(authToValidate).then(function(user) {
              Currentuser.setAuth(authToValidate, true);
              Currentuser.setUser(user);
              $rootScope.$broadcast('user:connected');
              self.save();
              deferred.resolve();
            }, function() {
              deferred.reject('auth.bad_password');
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
      var deferred = $q.defer();

      destroyFromStorageToo = angular.isDefined(destroyFromStorageToo) ? destroyFromStorageToo : true;

      if (this.isAuthenticated()) {
        $http.get('apis://logout').then(function() {
          // success
          if (destroyFromStorageToo) {
            ApiSessionStorageCookies.destroy();
          }
          Currentuser.setAuth(new ApiAuth());
          Currentuser.setUser(null);
          deferred.resolve();
          $rootScope.$broadcast('user:disconnected');
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

      this.$pristine = false;

      if (auth) {
        this.ackAuth(auth).then(function(user) {
          Currentuser.setAuth(auth, true);
          Currentuser.setUser(user);
          $rootScope.$broadcast('user:connected');
          deferred.resolve();
        }, deferred.resolve);
      } else {
        deferred.resolve('session.storage.no_session');
      }

      return deferred.promise;
    };

    this.ackAuth = function(auth) {
      var deferred = $q.defer();

      $http({
        method  : 'GET',
        url     : appConfig.api.url + 'user/me',
        // FIXME : Use $httpProvider.defaults.headers.common instead
        headers : angular.extend({'X-Requested-With': 'XMLHttpRequest'}, ApiCrypto.generateHeaders(auth, appConfig.api.url + 'user/me', 'GET', {}))
      }).then(function(response) {
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
