'use strict';

angular.module('squareteam.resources')
  .factory('UserResource', function($http, restmod) {

    // TODO(charly): add "me" relation ?

    return restmod.model('apis://users', {
      organizations : { hasMany : 'OrganizationResource' },
      // projects  : { hasMany : 'ProjectResource'},

      search : function(query) {
        return $http.get('apis://users/search', {
          params : {
            q : query
          }
        });
      },
      // Creating a user is a public route
      create : function(data) {
        return $http.post('api://user', data);
      }
    });
  });