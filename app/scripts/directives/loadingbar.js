'use strict';

angular.module('squareteam.app')
  .directive('loadingBar', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.prepend('<div class="loading-bar"></div>');

        scope.loading = false;
        scope.$watch('loading', function(isLoading) {
          element[isLoading ? 'addClass' : 'removeClass']('app-loading');
        });
      }
    };
  });
