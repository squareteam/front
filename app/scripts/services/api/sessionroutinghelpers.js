'use strict';

angular.module('squareteam.api')
  .provider('ApiSessionRoutingHelpers', function Apisessionroutinghelpers() {

    this.checkAuthenticated =  ['Currentuser', 'ApiSession', 'UserRessource', '$q',
      function(Currentuser, ApiSession, UserRessource, $q) {

        function configureUser (userId) {
          var organizations = UserRessource.organizations.query({
              userId : userId
            },
            {}, // data
            function() {
              if (organizations.length) {
                Currentuser.setOrganizations(organizations);
                deferred.resolve();
              } else {
                console.log('redirect to organization creation');
                // $state.go('register_organization');
                deferred.reject({
                  redirectToState : 'register_organization'
                });
              }
            }
          );
        }

        function isUserAuthenticated() {
          console.log('isUserAuthenticated?', ApiSession.isAuthenticated());
          if (ApiSession.isAuthenticated()) {
            if (!!Currentuser.getUser().organizations && Currentuser.getUser().organizations.length) {
              deferred.resolve();
            } else {
              configureUser(Currentuser.getUser().id);
            }
          } else {
            console.log('redirect to login');
            // $state.go('login');
            // $location.path('/login');
            deferred.reject({
              redirectToState : 'login'
            });
          }
        }

        var deferred = $q.defer();

        console.log('ApiSession.$pristine?', ApiSession.$pristine);

        if (ApiSession.$pristine) {
          ApiSession.restore().then(function() {
            isUserAuthenticated();
          }.bind(this));
        } else {
          isUserAuthenticated();
        }

        return deferred.promise;
      }
    ];

    this.$get = function() {};
  });
