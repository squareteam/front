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
      controller : function($scope, $element, $attrs, stTooltip) {

        var editProjectStatusScope  = $scope.$new(),
            $tooltip                = null;

        editProjectStatusScope.status = function(status) {
          $scope.project.status = status;
          $scope.project.$save().$then(function() {
            if ($tooltip) {
              $tooltip.hide();
              $tooltip = null;
            }
          });
        };

        $scope.openChangeStatusTooltip = function() {
          if (!$tooltip) {
            stTooltip.open('views/app/projects/tooltips/update_project_status_tooltip.html', 'edit_project_status', editProjectStatusScope).then(function(tooltip) {
              $tooltip = tooltip;
              $tooltip.showOnNode($($element).find('button.editable'), 25, 0, false);
            });
          } else {
            $tooltip.hide();
            $tooltip = null;
          }
        };
      }
    };
  });
