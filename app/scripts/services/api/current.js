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
  .service('CurrentSession', function CurrentSession($rootScope, $http, $q, appConfig, ApiAuth, ApiCrypto, ApiErrors, ApiSessionStorageCookies, UserResource) {
    this.$$user                 = null;
    this.$$auth                 = new ApiAuth();

  // GETTERS, STATES

    this.isAuthenticated = function() {
      return this.$$auth && this.$$auth.$isValid() && !!this.$$user;
    };

    this.getOrganizations = function() {
      // TODO(charly): add caching ?
      return UserResource.organizations.query({
        userId : this.$$user.id
      }).$promise;
    };

    this.getAuth = function() {
      return this.$$auth;
    };

    this.getUser = function() {
      return this.$$user;
    };

    // TODO(charly):  add $http interceptor to watch 
    //                PUT on /user/me to schedule user reload
    this.reloadUser = function() {
      $http.get('apis://user/me').then(function(response) {
        this.$$user = response.data;
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

      var deferred = $q.defer(),
          stored   = false;

      if (this.isAuthenticated()) {
        // try to store session
        try {
          stored = ApiSessionStorageCookies.store(this.getAuth());
        } catch (_) {}

        if (stored) {
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
          auth;

      try {
        auth = ApiSessionStorageCookies.retrieve();
      } catch (error) {
        deferred.resolve(error);
      }

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
