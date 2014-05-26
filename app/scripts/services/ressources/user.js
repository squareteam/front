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

    // Creating user is a public route
    userRessource.create = function(data) {
      return $http.post('api://user', data);
    };

    ////////////////////////
    // User Organizations //
    ////////////////////////
    userRessource.organizations = $resource('apis://users/:userId/organizations', {});

    return userRessource;
  });