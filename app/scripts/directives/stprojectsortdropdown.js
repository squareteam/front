'use strict';

angular.module('squareteam.app')
  .directive('stProjectSortDropdown', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element/*, attrs */) {
        element.text('this is the stprojectsortdropdown directive');
      }
    };
  });
