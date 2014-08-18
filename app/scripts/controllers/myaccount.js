'use strict';

angular.module('squareteam.app')
  .controller('MyAccountCtrl', function ($scope, $http, ApiSession, CurrentSession, UserResource, PasswordConfirmPopin, ApiErrors) {
    // Keep copy to know if password or email updated since last save
    var userData = angular.copy(CurrentSession.getUser());
    
    // INITIALIZE
    $scope.user = CurrentSession.getUser();
    $scope.organizations = [];

    CurrentSession.getOrganizations().then(function(organizations) {
      $scope.organizations = organizations;
    }, function() {
      console.error('Unable to load organizations for user #', userData.id);
    });

    function $$refreshSession (password) {
      ApiSession.login($scope.user.email, password).then(function() {
        userData = angular.copy($scope.user);
      }, function() {
        window.alert('Update failed !');
        $scope.user = userData;
      });
    }

    // EXPOSE METHODS

    $scope.passwordFormat = function() {
      $scope.passwordBadPractice = !$scope.user.password || $scope.user.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) === null;
    };

    $scope.updateUser = function() {
      UserResource.update({
        id : $scope.user.id
      }, {
        email : $scope.user.email,
        name  : $scope.user.name
      }, function() {

        // Force CurrentSession to reload user data
        if ($scope.user.email !== userData.email || ($scope.user.password && $scope.user.password.length)) {
          // need to re-register session, so prompt password
          PasswordConfirmPopin.prompt().then(function(confirmPassword) {

            if (($scope.user.password && $scope.user.password.length)) {

              $http.put('apis://user/me/change_password', {
                password  : $scope.user.password
              }).then(function() {
                CurrentSession.unregister(); // to prevent XHR on /logout (that will fail)
                $$refreshSession($scope.user.password);
              }, function() {
                window.alert('Update canceled !');
                $scope.user = userData;
              });
            } else {
              $$refreshSession(confirmPassword);
            }
          }, function() {
            window.alert('Update canceled !');
            $scope.user = userData;
          });
        } else {
          CurrentSession.reloadUser();
        }
      }, function(response) {
        if (response.error instanceof ApiErrors.Api) {
          angular.forEach(response.error.getErrors(), function(errorText) {
            if (errorText === 'api.already_taken.Email') {
              $scope.userForm.email.$setValidity('unique', false);
            }
          }.bind(this));
        }
      });
    };

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
