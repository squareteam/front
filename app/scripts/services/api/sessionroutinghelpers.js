'use strict';

angular.module('squareteam.api')
  .provider('ApiSessionRoutingHelpers', function Apisessionroutinghelpers() {

    this.checkAuthenticated =  ['Currentuser', 'ApiSession', 'UserRessource', '$q', '$location', function(Currentuser, ApiSession, UserRessource, $q, $location) {
      var deferred = $q.defer();
      
      function configureUser (userId) {
        var organizations = UserRessource.organizations.query({
          userId : userId
        },
        {}, // data
        function() {
          if (organizations.length) {
            var user = Currentuser.getUser();
            
            user.organizations = organizations;
            Currentuser.setUser(user);
            deferred.resolve();
          } else {
            deferred.reject();
            $location.path('/register/organization');
          }
        });
      }

      function isUserAuthenticated() {
        if (ApiSession.isAuthenticated()) {
          configureUser(Currentuser.getUser().id);
        } else {
          deferred.reject();
          $location.path('/login');
        }
      }

      if (ApiSession.$pristine) {
        ApiSession.restore().then(function() {
          isUserAuthenticated();
        }.bind(this));
      } else {
        isUserAuthenticated();
      }

      return deferred.promise;
    }];

    this.$get = function() {};
  });
