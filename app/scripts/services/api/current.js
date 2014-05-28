'use strict';

// Singleton that represent current active session
// 
//  Store current user info + current auth
//  
//  - `$register`   will try to validate a ApiAuth and
//                  set it at current session if valid
//                
//  - `$unregister` will set current session to anonymous (invalid)

angular.module('squareteam.app')
  .service('CurrentSession', function CurrentSession($rootScope, $http, $q, appConfig, ApiAuth, ApiCrypto, ApiErrors, UserRessource) {
    this.$$user                 = null;
    this.$$auth                 = new ApiAuth();
    this.$$organizations        = [];

    this.isAuthenticated = function() {
      return this.$$auth && this.$$auth.$isValid() && !!this.$$user;
    };

    this.getOrganizations = function() {
      // Replace by OrganizationResource /w caching
      return this.$$organizations;
    };

    this.getAuth = function() {
      return this.$$auth;
    };

    this.getUser = function() {
      return this.$$user;
    };

    this.$unregister = function() {
      this.$$auth = new ApiAuth();
      this.$$user = null;
      $rootScope.$broadcast('user:disconnected');
    };

    this.$register = function(auth) {
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

  });
