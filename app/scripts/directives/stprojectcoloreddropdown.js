'use strict';

angular.module('squareteam.app')
  .directive('stProjectColoredDropdown', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        element.text('this is the stprojectcoloredfilter directive');
      }
    };
  });
