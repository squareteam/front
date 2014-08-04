'use strict';

angular.module('squareteam.app')
  .directive('stCurrentUserBlock', function () {
    return {
      restrict: 'E',
      transclude : true,
      replace: true,
      templateUrl : 'scripts/directives/templates/stcurrentuserblock.html',
      link: function postLink(scope, element) {
        var button      = element.find('.icon'),
            dropdown    = element.find('.dropdown-menu');

        button.on('click', function() {
          dropdown.fadeToggle(100);
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
