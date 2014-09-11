/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stDateInput', function () {
    return {
      scope : {
        mask : '@'
      },
      templateUrl: 'scripts/directives/templates/stdateinput.html',
      replace : true,
      restrict: 'E',
      require : 'ngModel',
      link: function postLink(scope, element, attrs, ngModel) {

        function pad (numberStr) {
          return numberStr.toString().length < 2 ? '0' + numberStr : numberStr.toString();
        }

        ngModel.$render = function() {
          if (ngModel.$viewValue) {
            var date = ngModel.$viewValue;
            if (!(ngModel.$viewValue instanceof Date)) {
              date = new Date(ngModel.$viewValue);
            }

            if (date.toString() !== 'Invalid Date') {
              scope.day   = pad(date.getDate());
              scope.month = pad(date.getMonth() + 1);
              scope.year  = date.getFullYear();
            }
          }
        };

        scope.$watch('day + month + year', function() {

          if (scope.day && scope.month && scope.year) {
            ngModel.$setViewValue(new Date(
              scope.year,
              scope.month - 1,
              scope.day
            ));
          }

        });

        $(element).find('.day').on('focus', function() {
          $(element).find('.day').on('keyup', function() {
            if ($(element).find('.day').val().length === 2) {
              $(element).find('.month').focus();
            }
          });
        });

        $(element).find('.month').on('focus', function() {
          $(element).find('.month').on('keyup', function() {
            if ($(element).find('.month').val().length === 2) {
              $(element).find('.year').focus();
            }
          });
        });

      }
    };
  });
