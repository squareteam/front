'use strict';

angular.module('squareteam.app')
  .directive('stTopBar', function () {
    return {
      templateUrl: 'scripts/directives/templates/sttopbar.html',
      restrict: 'E',
      replace: true,
      controller: function(/*$scope, $element, $attrs, $location, CurrentSession*/) {
         
      }
    };
  });
