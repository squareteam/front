'use strict';

angular.module('squareteam.ressources')
  .factory('UserRessource', function($resource, $http) {
    var userRessource;

    userRessource = $resource('apis://users/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    userRessource.me = function() {
      return $http.get('apis://users/me');
    };

    userRessource.create = function(data) {
      return $http.post('api://user', data);
    };


    return userRessource;
  });