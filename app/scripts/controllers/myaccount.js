'use strict';

angular.module('squareteam.app')
  .controller('MyAccountCtrl', function ($scope, ApiSession, CurrentSession, UserResource) {
    var userData = angular.copy(CurrentSession.getUser());
    
    // INITIALIZE
    $scope.user = CurrentSession.getUser();
    $scope.organizations = [];

    CurrentSession.getOrganizations().then(function(organizations) {
      $scope.organizations = organizations;
    }, function() {
      console.error('Unable to load organizations for user #', userData.id);
    });

    // EXPOSE METHODS

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
          ApiSession.login($scope.user.email, window.prompt('Confirm password :'));
        } else {
          CurrentSession.reloadUser();
        }
      });
    };

    $scope.leaveOrganization = function(/*organizationId*/) {
      window.alert('Not implemented yet.');
    };
  });
