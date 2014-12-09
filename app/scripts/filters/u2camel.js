'use strict';

// see https://gist.github.com/popox/

angular.module('squareteam.app')
  .filter('u2camel', function(){
    return function(msg) {
      if (!angular.isString(msg)) {
        return '';
      } else {
        msg       = msg.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
        msg       = msg.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});

        return msg;
      }
    };
  });
