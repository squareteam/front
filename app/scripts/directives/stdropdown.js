/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stDropdown', function ($parse) {
    return {
      restrict: 'AC',
      link: function postLink($scope, $element, attrs) {
        var $dropdown           = $($element).find('.dropdown_menu'),
            position            = $parse(attrs.position  || 'absolute')($scope),
            topPadRaw           = $parse(attrs.topPad  || '')($scope),
            leftPadRaw          = $parse(attrs.leftPad || '')($scope),
            topPad              = !isNaN(parseInt(topPadRaw,0))  ? parseInt(topPadRaw, 10)  : 0,
            leftPad             = !isNaN(parseInt(leftPadRaw,0)) ? parseInt(leftPadRaw, 10) : 0,
            timeout;

        function closeDropdown () {
          $dropdown.fadeOut(200);

          $element.removeClass('dropdown-open');

        }


        $element.on('mouseenter', function(e) {

          if (!$dropdown.is(':visible')) {

            if (position === 'absolute') {
              var offset = $element.offset();
              $dropdown.css({
                top   : offset.top + topPad + 'px',
                left  : offset.left - ((parseInt($dropdown.css('width'), 10) - parseInt($(e.currentTarget).css('width'), 10))/2) - leftPad + 'px',
                display: 'none'
              });
            } else {
              $dropdown.css({
                top   : 0 + topPad + 'px',
                left  : 0 + leftPad + 'px',
                display: 'none'
              });
            }

            $dropdown.fadeIn(200);
            $element.addClass('dropdown-open');

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
