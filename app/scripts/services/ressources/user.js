'use strict';

angular.module('squareteam.ressources')
  .factory('User', function($resource) {
    var userRessource;

    userRessource = $resource('apis://users/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });


    userRessource.anonymous = function() {
      return {
        'identifier'  : 'anonymous',
        'token'       : ''
      };
    };

    return userRessource;
  });