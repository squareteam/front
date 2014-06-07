'use strict';

// Singleton that represent current active session
// 
//  Store current user info + current auth
//  
//  - `register`   will try to validate a ApiAuth and
//                  set it at current session if valid
//                
//  - `unregister` will set current session to anonymous (invalid)
//  
//  - `save`       will persist CurrentSession in cookies
//  
//  - `restore`    will try to restore CurrentSession from cookies

angular.module('squareteam.app')
  .service('CurrentSession', function CurrentSession($rootScope, $http, $q, appConfig, ApiAuth, ApiCrypto, ApiErrors, ApiSessionStorageCookies, UserRessource) {
    this.$$user                 = null;
    this.$$auth                 = new ApiAuth();

  // GETTERS, STATES

    this.isAuthenticated = function() {
      return this.$$auth && this.$$auth.$isValid() && !!this.$$user;
    };

    this.getOrganizations = function() {
      // TODO(charly): add caching ?
      return UserRessource.organizations.query({
        userId : this.$$user.id
      }).$promise;
    };

    this.getAuth = function() {
      return this.$$auth;
    };

    this.getUser = function() {
      return this.$$user;
    };

    this.reloadUser = function() {
      $http.get('apis://user/me').then(function(response) {
        console.log(this.$$user);
        this.$$user = response.data;
        console.log(this.$$user);
      }.bind(this), function() {
        this.unregister();
      }.bind(this));
    };

    // API

    this.unregister = function() {
      this.$$auth = new ApiAuth();
      this.$$user = null;
      $rootScope.$broadcast('user:disconnected');
    };

    this.register = function(auth) {
      var self      = this,
          deferred  = $q.defer();

      $http({
        method  : 'GET',
        url     : appConfig.api.url + 'user/me',
        // FIXME : Use $httpProvider.defaults.headers.common instead
        headers : angular.extend({'X-Requested-With': 'XMLHttpRequest'}, ApiCrypto.generateHeaders(auth, appConfig.api.url + 'user/me', 'GET', {}))
      }).then(function(response) {
        self.$$auth = auth;
        self.$$user = response.data;
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

    this.save = function() {

      var deferred = $q.defer();

      if (this.isAuthenticated()) {
        if (ApiSessionStorageCookies.store(this.getAuth())) {
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
        this.register(auth).then(function() {
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
