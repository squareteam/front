'use strict';

angular.module('squareteam.app')
  .directive('stProjectEditIcon', function () {
    return {
      template: '<i class="icon icon-settings"></i>',
      restrict: 'E',
      replace: true,
      scope : {
        project : '='
      },
      controller : function($scope, $element, $attrs, moment, ngDialog, stTooltip) {

        var editProjectScope  = $scope.$new(),
            $tooltips         = {};

        editProjectScope.edit = function() {
          
          var dialog,
              updateProjectScope = $scope.$new();

          updateProjectScope.project = {
            title       : $scope.project.title,
            description : $scope.project.description,
            deadline    : $scope.project.deadline
          };

          updateProjectScope.updateProject = function() {
            if (updateProjectScope.project.deadline instanceof Date) {
              $scope.project.deadline = moment(updateProjectScope.project.deadline).toISOString();
            }
            $scope.project.title = updateProjectScope.project.title;
            $scope.project.description = updateProjectScope.project.description;

            $scope.project.$save().$then(dialog.close);
          };

          if ($tooltips.updateProject) {
            $tooltips.updateProject.hide();
          }
          dialog = ngDialog.open({
            template  : 'views/app/projects/popins/update_project_popin.html',
            scope     : updateProjectScope
          });

        };

        editProjectScope.delete = function() {
          if($tooltips.updateProject) {
            $tooltips.updateProject.hide();
          }
          $scope.project.$destroy();
        };

        $element.on('click', function() {
          $scope.openUpdateProjectTooltip();
        });

        $scope.openUpdateProjectTooltip = function() {
          if (!$tooltips.updateProject) {
            stTooltip.open('views/app/projects/tooltips/edit_project_tooltip.html', 'edit_project', editProjectScope).then(function(tooltip) {
              $tooltips.updateProject = tooltip;
              $tooltips.updateProject.showOnNode($element, 30);
            });
          } else {
            $tooltips.updateProject.hide();
            $tooltips.updateProject = null;
          }
        };

      }
    };
  });
