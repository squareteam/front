'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function(restmod) {
    return restmod.model(null, {
      deadline : {
        encode : function(value) {
          return value ? value : '';
        },
        chain: true
      }
    });
  });