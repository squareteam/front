'use strict';

// usage :
// 
// <st-organization-projects  ng-repeat="organization in organizations track by organization.id"
//                            organization-id="{{ organization.id }}"
//                            collapsed="$index > 2">
// </st-organization-projects>

angular.module('squareteam.app')
  .directive('stOrganizationProjects', function () {
    return {
      scope : {
        organizationId  : '@',
        collapsed       : '@'
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
