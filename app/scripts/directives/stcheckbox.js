'use strict';

angular.module('squareteam.app')
  .directive('stCheckbox', function () {
    return {
      scope: {
        type      : '@',
        label     : '=',
        onChange  : '&'
      },
      templateUrl: 'scripts/directives/templates/stcheckbox.html',
      restrict: 'E',
      replace: true,
      require : 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {

        ngModel.$render = function() {
          if (ngModel.$viewValue === true || ngModel.$viewValue === false) {
            scope.value = ngModel.$viewValue;
          }
        };

        scope.updateValue = function(value) {
          if (value === true || value === false) {
            scope.value = value;
            ngModel.$setViewValue(value);
          }
        };

      }
    };
  });
