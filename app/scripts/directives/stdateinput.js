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
        ngModel.$render = function() {}; // TODO

        scope.$watch('day + month + year', function() {

          if (scope.day && scope.month && scope.year) {
            ngModel.$setViewValue(new Date(
              scope.year,
              scope.month - 1,
              scope.day
            ));
          }

        });

        $('.day').on('focus', function() {
          $('.day').on('keyup', function() {
            if ($('.day').val().length === 2) {
              $('.month').focus();
            }
          });
        });

        $('.month').on('focus', function() {
          $('.month').on('keyup', function() {
            if ($('.month').val().length === 2) {
              $('.year').focus();
            }
          });
        });

      }
    };
  });
