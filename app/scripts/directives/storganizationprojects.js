'use strict';

// usage :
// 
// <st-organization-projects  organization-id="{{ organization.id }}">
// </st-organization-projects>

angular.module('squareteam.app')
  .directive('stOrganizationProjects', function () {
    return {
      scope : {
        organizationId  : '@'
      },
      templateUrl: 'scripts/directives/templates/storganizationprojects.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, ProjectResource) {
        ProjectResource.load($scope.organizationId, { apiCache : true }).then(function(data) {
          $scope.organization = {
            name : 'SWCC',
            id   : 0,
            projects : data.projects
          };
        }, function() {
          // display error
        });
      }
    };
  });
