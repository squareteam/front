'use strict';

angular.module('squareteam.app')
  .directive('stCurrentUserBlock', function () {
    return {
      restrict: 'E',
      transclude : true,
      templateUrl : 'scripts/directives/templates/stcurrentuserblock.html',
      link: function postLink(scope, element) {
        var userAvatar  = element.find('.user-avatar'),
            dropdown    = element.find('.dropdown-menu');

        dropdown.css('marginTop', '40px');

        userAvatar.on('mouseover', function() {
          dropdown.show();
        });

        dropdown.on('mouseleave', function() {
          dropdown.hide();
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
