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
      replace : true
    };
  });
