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

        var editProjectBtn    = $($element).find('.icon-settings'),
            editProjectScope  = $scope.$new(),
            $tooltip          = null;

        editProjectScope.edit = function() {
          
          var dialog,
              updateProjectScope = $scope.$new();

          updateProjectScope.project = $scope.project;

          updateProjectScope.updateProject = function() {
            $scope.project.title        = updateProjectScope.project.title;
            $scope.project.description  = updateProjectScope.project.description;
            $scope.project.$save().$then(dialog.close);
          };

          if ($tooltip) {
            $tooltip.hide();
          }
          dialog = ngDialog.open({
            template  : 'views/app/projects/update_project_popin.html',
            scope     : updateProjectScope
          });

        };

        editProjectScope.delete = function() {
          if($tooltip) {
            $tooltip.hide();
          }
          $scope.$emit('project:delete', $scope.project);
        };

        editProjectScope.archive = function() {
          console.log('feature not supported for now..');
        };

        editProjectBtn.on('click', function() {
          if (!$tooltip) {
            stTooltip.open('views/app/projects/edit_project_tooltip.html', 'edit_project', editProjectScope).then(function(tooltip) {
              $tooltip = tooltip;
              $tooltip.showOnNode(editProjectBtn, 30);
            });
          } else {
            $tooltip.hide();
            $tooltip = null;
          }
        });

      }
    };
  });
