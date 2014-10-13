/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stCurrentUserBlock', function ($timeout) {
    return {
      restrict: 'E',
      transclude : true,
      replace: true,
      templateUrl : 'scripts/directives/templates/stcurrentuserblock.html',
      link: function postLink(scope, element) {
        var button        = element.find('.avatar'),
            dropdown      = element.find('.user_dropdown'),
            $dropdown     = $(dropdown),
            buttonOffset  = button.offset();

        function onClickOutsideHandler (e) {
          if ($dropdown === e.target || $.contains($dropdown, e.target)) {
            return;
          }

          if ($dropdown.is(':visible')) {
            $dropdown.hide();
            $(document).off('click', onClickOutsideHandler);
          }
        }

        dropdown.css({
          top   : buttonOffset.top + 65 + 'px',
          left  : buttonOffset.left - ((parseInt(dropdown.css('width'), 10) - parseInt(button.css('width'), 10))/2) - 20 + 'px'
        });

        button.on('click', function() {
          if (!$dropdown.is(':visible')) {
            dropdown.fadeIn(200);
            $timeout(function() {
              $(document).on('click', onClickOutsideHandler);
            }, 300);
          }
        });

        dropdown.on('click', function() {
          dropdown.hide();
        });

        scope.$watch('currentSession.isAuthenticated()', function(authenticated) {
          element[authenticated ? 'show' : 'hide']();
        });

        scope.$watch('currentSession.getUser()', function(currentUser) {
          if (currentUser) {
            scope.userName = currentUser.name;
          }
        });

      }
    };
  });
