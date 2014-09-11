/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stFilterDropdown', function () {
    return {
      scope : {
        'stFilterDropdown'  : '=',
        'placeholder'       : '@',
        'dropdownClasses'   : '@'
      },
      restrict: 'AC',
      priority : 10,
      transclude : true,
      replace : true,
      templateUrl : 'scripts/directives/templates/stfilterdropdown.html',
      require : 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {
        var dropdownMenu = $(element).find('.dropdown_menu').first();

        scope.selected = null;

        dropdownMenu.delegate('li', 'mouseover', function(e) {
          $(e.currentTarget).css('backgroundColor', $(e.currentTarget).data('color'));
        });

        dropdownMenu.delegate('li', 'mouseout', function(e) {
          $(e.currentTarget).css('backgroundColor', '');
        });


        function setValue (item) {
          if (!item) {
            element.removeClass('active');
            element.css('backgroundColor', '');
            scope.selected = null;
          } else {
            element.addClass('active');
            element.css('backgroundColor', item.color);
            scope.selected = item;
          }
        }

        scope.selectById = function(selectedIndex) {
          if (angular.isNumber(selectedIndex) && scope.stFilterDropdown[selectedIndex]) {

            setValue(scope.stFilterDropdown[selectedIndex]);
            ngModel.$setViewValue(scope.selected.value);

          }
        };

        ngModel.$render = function() {
          var value =  ngModel.$viewValue || '',
              index = -1;

          for (var i = scope.stFilterDropdown.length - 1; i >= 0; i--) {
            if (scope.stFilterDropdown[i].value === value) {
              index = i;
            }
          }

          if (index > -1) {
            setValue(scope.stFilterDropdown[index]);
          } else {
            setValue(null);
          }
        };

      }
    };
  });
