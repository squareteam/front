'use strict';

// usage :
// 
// <st-organization-projects ng-repeat="organization in organizations" organization-id="{{ organization.id }}"></st-organization-projects>

angular.module('squareteam.app')
  .directive('stOrganizationProjects', function () {
    return {
      scope : {
        organizationId : '@'
      },
      templateUrl: 'scripts/directives/templates/storganizationprojects.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, OrganizationResource) {
        OrganizationResource.projects($scope.organizationId).then(function(projects) {
          $scope.projects = projects;
        }, function() {
          // display error
        });
      }
    };
  });
