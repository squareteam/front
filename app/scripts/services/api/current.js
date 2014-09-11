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
  .service('CurrentSession', function CurrentSession($rootScope, $http, $q, appConfig, ApiAuth, ApiCrypto, ApiErrors, ApiSessionStorageCookies, UserResource, AclRoles) {
    this.$$user = null;
    this.$$auth = new ApiAuth();

    // Three dimensional hash [organizationId][model][action] = true/false
    this.$$userPermissions = {};

    // ACL

    // TODO(charly): should be called when changed made to
    //  - organization (create, delete)
    //  - teams
    this.$$reloadUserPermissions = function() {
      var deferred = $q.defer();

      this.getUser().teams.$refresh().$then(angular.bind(this, function(teams) {

        angular.forEach(teams, function(team) {
          angular.forEach(team.users, function(user) {
            if (user.id === this.$$user.id) {
              this.$$userPermissions[team.organizationId] = AclRoles.asBooleanMap(user.permissions);
            }
          }, this);
        }, this);

        deferred.resolve();

      }), deferred.reject);

      return deferred.promise;
    };

    this.userCanDo = function(doWhat, onWhat, organizationId) {
      if (!organizationId) {
        return true; // creator
      } else {
        // O(1)
        return  this.$$userPermissions[organizationId]                  &&
                this.$$userPermissions[organizationId][onWhat]          &&
                this.$$userPermissions[organizationId][onWhat][doWhat];
      }
    };

    this.isAuthenticated = function() {
      return this.$$auth && this.$$auth.$isValid() && !!this.$$user;
    };

    // OAuth helpers

    this.isOAuthAccount = function() {
      return this.$$user.provider.toLowerCase() !== 'squareteam';
    };

    // GETTERS

    this.getOrganizations = function() {
      return this.$$user.organizations.$refresh().$promise;
    };

    this.getAuth = function() {
      return this.$$auth;
    };

    this.getUser = function() {
      return this.$$user;
    };

    // Current session management

    this.reloadUser = function() {
      $http.get('apis://users/me').then(function(response) {
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
        url     : appConfig.api.url + 'users/me',
        // FIXME : Use $httpProvider.defaults.headers.common instead
        headers : angular.extend({'X-Requested-With': 'XMLHttpRequest'}, ApiCrypto.generateHeaders(auth, appConfig.api.url + 'users/me', 'GET', {}))
      }).then(function(response) {
        self.$$auth = auth;
        self.$$user = UserResource.$buildRaw(response.data);
        $rootScope.$broadcast('user:connected');
        self.$$reloadUserPermissions().then(function() {
          deferred.resolve(response.data);
        }, deferred.reject);
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
