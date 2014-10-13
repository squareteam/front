/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stDropdown', function ($parse, $timeout) {
    return {
      restrict: 'AC',
      link: function postLink($scope, $element, attrs) {
        var $dropdown           = $($element).find('.dropdown_menu'),
            position            = $parse(attrs.position  || 'absolute')($scope),
            topPadRaw           = $parse(attrs.topPad  || '')($scope),
            leftPadRaw          = $parse(attrs.leftPad || '')($scope),
            topPad              = !isNaN(parseInt(topPadRaw,0))  ? parseInt(topPadRaw, 10)  : 0,
            leftPad             = !isNaN(parseInt(leftPadRaw,0)) ? parseInt(leftPadRaw, 10) : 0;

        function closeDropdown () {
          $dropdown.fadeOut(200);
          $element.removeClass('dropdown-open');
        }

        function onClickOutsideHandler (e) {
          if ($dropdown === e.target || $.contains($dropdown, e.target)) {
            return;
          }

          if ($dropdown.is(':visible')) {
            $dropdown.hide();
            closeDropdown();
            $(document).off('click', onClickOutsideHandler);
          }
        }

        function setupOnClickOutside () {
          $(document).on('click', onClickOutsideHandler);
        }

        $element.on('click', function(e) {

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
            $timeout(function() {
              setupOnClickOutside();
            }, 300);

          } else {
            closeDropdown();
          }

        });

        $dropdown.on('click', function() {
          closeDropdown();
        });

        // $dropdown.on('mouseenter', function() {
        //   if (timeout) {
        //     clearTimeout(timeout);
        //   }
        // });

        // $element.on('mouseleave', function() {
        //   timeout = setTimeout(function() {
        //     closeDropdown();
        //   }, 300);
        // });

        // $dropdown.on('mouseleave', function() {
        //   closeDropdown();
        // });

      }
    };
  });
