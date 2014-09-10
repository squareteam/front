'use strict';

angular.module('squareteam.resources')
  .factory('TeamResource', function($resource, $http, $q, restmod) {
    return restmod.model('apis://teams', {
      users : { hasMany : restmod.model(null) }
    });
  });

