'use strict';

angular.module('squareteam.resources')
  .factory('UserResource', function($resource, $http) {
    var userResource;

    userResource = $resource('apis://users/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    // Creating user is a public route
    userResource.create = function(data) {
      return $http.post('api://users', data);
    };

    userResource.search = function(query) {
      return $http.get('apis://users/search', {
        params : {
          q : query
        }
      });
    };

    ////////////////////////
    // User Organizations //
    ////////////////////////
    userResource.organizations = $resource('apis://users/:userId/organizations', {});

    return userResource;
  });
