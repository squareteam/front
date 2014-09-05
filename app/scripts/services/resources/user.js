'use strict';

angular.module('squareteam.resources')
  .factory('UserResource', function($http, restmod) {
    var User = restmod.model('apis://users', {
      organizations : { hasMany : 'OrganizationResource' },
      projects      : { hasMany : 'ProjectResource' }
    });

    User.search = function(query) {
      return $http.get('apis://users/search', {
        params : {
          q : query
        }
      });
    };

    // Creating a user is a public route
    User.create = function(data) {
      return $http.post('api://users', data);
    };

    // FIXME(charly): find a better way to identify model class..
    User.NAME = 'User';

    return User;
  });
