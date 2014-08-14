'use strict';

// usage :
// 
// <st-projects-list organization-id="{{ organization.id }}">
// </st-projects-list>

angular.module('squareteam.app')
  .directive('stProjectsList', function ($rootScope, ngDialog) {
    return {
      scope : {
        organizationId  : '@'
      },
      templateUrl: 'scripts/directives/templates/stprojectslist.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $http, ProjectResource,  CurrentSession) {

        var organizations = [];

        CurrentSession.getOrganizations().then(function(_organizations) {
          organizations = _organizations;
        });

        $scope.loadProjects = function() {
          function projectsLoaded (collection) {
            $scope.projectCollection = collection;
            $scope.projects = collection.projects;
          }

          if ($scope.organizationId) {
            $scope.organization = {
              name  : 'Organization' + $scope.organizationId,
              id    : $scope.organizationId
            };

            ProjectResource.fromOrganization($scope.organizationId).then(projectsLoaded);
          } else {
            if (organizations.length) {
              $scope.organization = organizations[0];

              ProjectResource.fromOrganization(organizations[0]).then(projectsLoaded);
            } else {
              $scope.organization = null;

              ProjectResource.fromUser(CurrentSession.getUser().id).then(projectsLoaded);
            }
          }
        };

        // Load projects at startup
        $scope.loadProjects();

        $scope.createProjectPopin = function() {
          var dialog,
              createProjectPopinScope = $rootScope.$new();

          createProjectPopinScope.createProject = function() {
            $scope.projectCollection.create(createProjectPopinScope.project).then(function() {
              $scope.loadProjects();
              dialog.close();
            });
          };

          dialog = ngDialog.open({
            template  : 'views/app/projects/create_project_popin.html',
            scope     : createProjectPopinScope
          });
        };

      }
    };
  });
