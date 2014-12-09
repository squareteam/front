'use strict';

// see https://gist.github.com/wittydeveloper/2550ea170034db9691e5

angular.module('squareteam.app')
  .filter('nl2br', function($sce){
    return function(msg,isXhtml) {
      if (!angular.isString(msg)) {
        return '';
      } else {
        isXhtml   = isXhtml || true;
        msg       = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ (isXhtml ? '<br />' : '<br>') +'$2');

        return $sce.trustAsHtml(msg);
      }
    };
  });