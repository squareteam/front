/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stSortDropdown', function () {
    return {
      scope : {
        'stSortDropdown'    : '=',
        'placeholder'       : '@',
        'dropdownClasses'   : '@'
      },
      restrict: 'AC',
      priority : 10,
      transclude : true,
      replace : true,
      templateUrl : 'scripts/directives/templates/stsortdropdown.html',
      require : 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {

        scope.selected = null;

        function setValue (item) {
          element.removeClass('icon-sort-asc');
          element.removeClass('icon-sort-desc');

          if (!item) {
            element.removeClass('active');
            scope.selected = null;
          } else {
            element.addClass('active');
            element.addClass('icon-sort-' + item.dir);
            scope.selected = item;
          }
        }

        scope.$watch('selectedIndex', function(selectedIndex) {
          if (angular.isNumber(selectedIndex) && scope.stSortDropdown[selectedIndex]) {

            setValue(scope.stSortDropdown[selectedIndex]);
            ngModel.$setViewValue(scope.selected.value);

          }
        });

        ngModel.$render = function() {
          var value =  ngModel.$viewValue || '',
              index = -1;

          for (var i = scope.stSortDropdown.length - 1; i >= 0; i--) {
            if (scope.stSortDropdown[i].value === value) {
              index = i;
            }
          }

          if (index > -1) {
            setValue(scope.stSortDropdown[index]);
          } else {
            setValue(null);
          }
        };

      }
    };
  });
