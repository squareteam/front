'use strict';

angular.module('squareteam.app')
  .directive('stMissionItem', function () {
    return {
      scope : {
        mission : '='
      },
      templateUrl: 'scripts/directives/templates/stmissionitem.html',
      restrict: 'E',
      replace : true//,
      /*controller : function($scope, $element, $attrs, moment) {
        
      }*/
    };
  });
