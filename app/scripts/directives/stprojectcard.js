'use strict';

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
