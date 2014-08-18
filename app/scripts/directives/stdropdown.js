/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stDropdown', function () {
    return {
      scope: {
        topPad  : '@',
        leftPad : '@',
        dropdown: '@',
        onShow  : '&',
        onHide  : '&'
      },
      // transclude: true,
      restrict: 'AC',
      link: function postLink($scope, $element) {
        var $dropdown           = $($scope.dropdown),
            topPad              = !isNaN(parseInt($scope.topPad,0))  ? parseInt($scope.topPad, 10)  : 0,
            leftPad             = !isNaN(parseInt($scope.leftPad,0)) ? parseInt($scope.leftPad, 10) : 0,
            // elementPlaceholder  = $element.text(),
            timeout;

        function closeDropdown () {
          $dropdown.fadeOut(200);

          $element.removeClass('dropdown-open');

          if ($scope.onHide) {
            $scope.onHide({ element : $element });
          }
        }


        $element.on('mouseenter', function(e) {
          var offset = $element.offset();

          if (!$dropdown.is(':visible')) {
            $dropdown.css({
              top   : offset.top + topPad + 'px',
              left  : offset.left - ((parseInt($dropdown.css('width'), 10) - parseInt($(e.currentTarget).css('width'), 10))/2) - leftPad + 'px',
              display: 'none'
            }).fadeIn(200);

            $element.addClass('dropdown-open');

            if ($scope.onShow) {
              $scope.onShow({ element : $element });
            }
          }

        });

        $dropdown.on('click', function() {
          closeDropdown();
        });

        $dropdown.on('mouseenter', function() {
          if (timeout) {
            clearTimeout(timeout);
          }
        });

        $element.on('mouseleave', function() {
          timeout = setTimeout(function() {
            closeDropdown();
          }, 300);
        });

        $dropdown.on('mouseleave', function() {
          closeDropdown();
        });

      }
    };
  });
