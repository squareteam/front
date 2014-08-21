'use strict';

angular.module('squareteam.app')
  .controller('MyAccountCtrl', function ($scope, $http, $location, ApiSession, CurrentSession, UserResource, PasswordConfirmPopin, appConfig) {

    // INITIALIZE
    $scope.isOAuthAccount = CurrentSession.isOAuthAccount();
    $scope.user           = CurrentSession.getUser();
    $scope.organizations  = [];

    CurrentSession.getOrganizations().then(function(organizations) {
      $scope.organizations = organizations;
    }, function() {
      console.error('Unable to load organizations for user #', $scope.user.id);
    });

    function $$refreshSession (password) {
      ApiSession.login($scope.user.email, password).catch(function() {
        window.alert('Refresh session failed !');
        $scope.user.$restore();
      });
    }

    function redirectOAuthRefreshSession () {
      var endpoint = appConfig.api.oauth[$scope.user.provider] && appConfig.api.oauth[$scope.user.provider].endpoint;
      if (endpoint) {
        $location.url(endpoint);
      } else {
        window.alert('oauth redirection failed, logout..');
        CurrentSession.unregister(); // to prevent XHR on /logout (that will fail)
        $location.path('/');
      }
    }

    // EXPOSE METHODS

    $scope.updateUser = function() {
      $scope.user.$save().$then(function() {

        // Force CurrentSession to reload user data
        if ($scope.user.$dirty('password') || $scope.user.$dirty('email')) {

          if ($scope.isOAuthAccount) {
            redirectOAuthRefreshSession();
          } else {
            // need to re-register session, so prompt password
            PasswordConfirmPopin.prompt().then(function(confirmPassword) {

              if ($scope.user.$dirty('password')) {

                $http.put('apis://user/me/change_password', {
                  password  : $scope.user.password
                }).then(function() {
                  CurrentSession.unregister(); // to prevent XHR on /logout (that will fail)
                  $$refreshSession($scope.user.password);
                }, function() {
                  window.alert('Update canceled !');
                  $scope.user.$restore();
                });
              } else {
                $$refreshSession(confirmPassword);
              }
            }, function() {
              window.alert('Update canceled !');
              $scope.user.$restore();
            });
          }
        } else {
          CurrentSession.reloadUser();
        }
      }, function() {
        window.alert('update failed');
        $scope.user.$restore();
      });
    };
    // TODO(charly) : refactor with use of restomod::RecordApi
    $scope.leaveOrganization = function(organizationId) {
      $http.delete('apis://organizations/'+organizationId+'/user/'+CurrentSession.getUser().id).then(function() {
        // remove organizationId from $scope.organizations
        var index = -1;

        angular.forEach($scope.organizations, function(organization, i) {
          if (organization.id === organizationId) {
            index = i;
          }
        });

        if (index >= 0) {
          $scope.organizations.splice(index, 1);
        }

      }, function() {
        window.alert('Error while leaving organization, aborted.');
      });
    };
  });
