/* global $ */

'use strict';

// TODO(charly):
//  - if projectId -> load project
//  - if project -> use object as data

angular.module('squareteam.app')
  .directive('stProjectCard', function () {
    return {
      scope : {
        project : '='
      },
      templateUrl: 'scripts/directives/templates/stprojectcard.html',
      restrict: 'E',
      replace : true,
      controller : function($scope, $element, $attrs, stTooltip, ngDialog) {

        var editProjectBtn          = $($element).find('.icon-settings'),
            editProjectScope        = $scope.$new(),
            editProjectStatusScope  = $scope.$new(),
            $tooltips               = {};

        editProjectStatusScope.status = function(status) {
          $scope.project.status = status;
          $scope.project.$save().$then(function() {
            if ($tooltips.updateProjectStatus) {
              $tooltips.updateProjectStatus.hide();
              $tooltips.updateProjectStatus = null;
            }
          });
        };

        editProjectScope.edit = function() {
          
          var dialog,
              updateProjectScope = $scope.$new();

          updateProjectScope.project = $scope.project;

          updateProjectScope.updateProject = function() {
            $scope.project.title        = updateProjectScope.project.title;
            $scope.project.description  = updateProjectScope.project.description;
            $scope.project.deadline     = updateProjectScope.project.deadline;
            $scope.project.$save().$then(dialog.close);
          };

          if ($tooltips.updateProject) {
            $tooltips.updateProject.hide();
          }
          dialog = ngDialog.open({
            template  : 'views/app/projects/update_project_popin.html',
            scope     : updateProjectScope
          });

        };

        editProjectScope.delete = function() {
          if($tooltips.updateProject) {
            $tooltips.updateProject.hide();
          }
          $scope.$emit('project:delete', $scope.project);
        };

        editProjectScope.archive = function() {
          console.log('feature not supported for now..');
        };

        $scope.openUpdateProjectTooltip = function() {
          if (!$tooltips.updateProject) {
            stTooltip.open('views/app/projects/edit_project_tooltip.html', 'edit_project', editProjectScope).then(function(tooltip) {
              $tooltips.updateProject = tooltip;
              $tooltips.updateProject.showOnNode(editProjectBtn, 30);
            });
          } else {
            $tooltips.updateProject.hide();
            $tooltips.updateProject = null;
          }
        };

        $scope.openChangeStatusTooltip = function() {
          if (!$tooltips.updateProjectStatus) {
            stTooltip.open('views/app/projects/update_project_status_tooltip.html', 'edit_project_status', editProjectStatusScope).then(function(tooltip) {
              $tooltips.updateProjectStatus = tooltip;
              $tooltips.updateProjectStatus.showOnNode($($element).find('button.editable'), 25);
            });
          } else {
            $tooltips.updateProjectStatus.hide();
            $tooltips.updateProjectStatus = null;
          }
        };
      }
    };
  });
