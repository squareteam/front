'use strict';

angular.module('squareteam.app')
  .service('stUtils', function stTooltip($window, $timeout) {
    return {
      // needed cause Angular does not provide a way to
      // redirect to absUrl or not safe url easily
      redirect : function(url, timeout) {
        timeout = angular.isNumber(timeout) ? timeout : 0;
        $timeout(function() {
          $window.location = url;
        }, timeout);
      }
    };
  });