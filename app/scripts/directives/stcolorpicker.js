'use strict';

angular.module('squareteam.app')
  .directive('stColorPicker', function () {
    return {
      scope : {
        colors : '='
      },
      templateUrl: 'scripts/directives/templates/stcolorpicker.html',
      restrict: 'E',
      replace: true,
      require : 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {

        scope.$watch('selectedColor', function(selectedColor) {
          if (angular.isString(selectedColor)) {
            ngModel.$setViewValue(selectedColor);
          }
        });

        ngModel.$render = function() {
          var value =  ngModel.$viewValue || null;

          if (angular.isString(value)) {
            scope.selectedColor = value;
          }
        };

      }
    };
  });
