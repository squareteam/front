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

        var editProjectBtn    = $($element).find('.icon-settings'),
            editProjectScope  = $scope.$new(),
            $tooltip          = null;

        editProjectScope.edit = function() {
          console.log('edit project', $scope.project.id);
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
