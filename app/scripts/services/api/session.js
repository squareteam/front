/*global CryptoJS*/
'use strict';

angular.module('squareteam.api')
  .service('ApiSession', function Apisession($rootScope, $http, $q, appConfig, Currentuser, ApiSessionStorageCookies, ApiAuth, ApiCrypto) {
    
    this.apiAuth = new ApiAuth(); // invalid ApiAuth by default == anonymous

    this.isAnonymous = function() {
      return !Currentuser.getAuth().isValid();
    };

    this.login = function(login, password) {
      var deferred        = $q.defer(),
          authToValidate  = new ApiAuth(),
          self            = this;

      $http.get('api://login', {
        login : login
      }).then(function(response) {
        
        if (response && response.data &&
            response.data.salt1 && response.data.salt1.length > 0 &&
            response.data.salt2 && response.data.salt2.length > 0) {

          authToValidate.identifier = login;
          authToValidate.token      = ApiCrypto.generateToken(login, password, CryptoJS.enc.Hex.parse(response.data.salt1), CryptoJS.enc.Hex.parse(response.data.salt2));

          self.ackAuth(authToValidate).then(function(user) {
            Currentuser.setAuth(authToValidate);
            Currentuser.setUser(user);
            $rootScope.$broadcast('user:connected');
            deferred.resolve();
          }, function() {
            deferred.reject('auth.bad_password');
          });
        } else {
          deferred.reject('api.response_malformed');
        }
      }, function() {
        deferred.reject('auth.bad_login');
      });

      return deferred.promise;
    };

    this.logout = function(destroyFromStorageToo) {
      var deferred = $q.defer();

      destroyFromStorageToo = destroyFromStorageToo || true;

      if (!this.isAnonymous()) {
        $http('apis://logout').then(function() {
          // success
          if (destroyFromStorageToo) {
            ApiSessionStorageCookies.destroy();
          }
          deferred.resolve();
          $rootScope.$broadcast('user:disconnected');
        }, function(error) {
          // error
          deferred.reject(error);
        });
      } else {
        deferred.reject('session.invalid');
      }
      
      return deferred.promise;
    };

    this.save = function() {

      var deferred = $q.defer();

      if (!this.isAnonymous()) {
        
      } else {
        deferred.reject('session.invalid');
      }
      
      return deferred.promise;

    };

    this.restore = function() {
      var deferred  = $q.defer(),
          auth      = ApiSessionStorageCookies.retrieve();

      if (auth) {
        this.ackAuth(auth).then(function(user) {
          Currentuser.setAuth(auth);
          Currentuser.setUser(user);
          $rootScope.$broadcast('user:connected');
          deferred.resolve();
        }, deferred.resolve);
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    };

    this.ackAuth = function(auth) {
      var deferred = $q.defer();

      $http({
        method  : 'GET',
        url     : appConfig.api.url + 'user/me',
        headers : ApiCrypto.generateHeaders(auth, appConfig.api.url + 'user/me', 'GET', {})
      }).then(function(response) {
        deferred.resolve(response.data.user);
      }, function() {
        deferred.reject('auth.invalid');
      });
      
      return deferred.promise;
    };
  });
