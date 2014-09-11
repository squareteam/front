'use strict';

angular.module('squareteam.app').
  controller('Organizations', function($scope, $http, CurrentSession) {

    CurrentSession.getOrganizations().then(function(organizations) {
      $scope.organizations = organizations;
    });

    // TODO(charly) : refactor with use of restomod::RecordApi
    $scope.leaveOrganization = function(organizationId) {
      $http.delete('apis://organizations/'+organizationId+'/users/'+CurrentSession.getUser().id).then(function() {
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
        alert('Error while leaving organization, aborted.');
      });
    };

  });