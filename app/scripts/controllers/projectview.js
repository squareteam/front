/* globals $ */

'use strict';

angular.module('squareteam.app')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, ProjectResource) {

    ProjectResource.$search().$then(function(projects) {
      $scope.projects = projects;

      var currentProject = $.grep($scope.projects, function(project) {
        return +project.id === +$stateParams.projectId;
      });

      if (currentProject.length === 1) {
        $scope.changeProject(currentProject[0]);
      } else {
        console.error('Project not found ! #' + $stateParams.projectId);
      }
    });

    $scope.changeProject = function(project) {
      $scope.project = project;
    };

    $scope.filteredProjects = function() {
      return (!!$scope.projects && $scope.project) ? $.grep($scope.projects, function(project) {
        return project.id !== $scope.project.id;
      }) :  [];
    };

  });
