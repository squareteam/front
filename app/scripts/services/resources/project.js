'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function($resource, $cacheFactory) {
    var projectResource;

    projectResource = $resource('apis://projects/:id', {}, {
      update: {
        method: 'PUT'
      },
      query : {
        method    : 'GET',
        isArray   : true,
        cache     : $cacheFactory('projects')
      },
      get : {
        method    : 'GET',
        cache     : $cacheFactory('projects')
      }
    });

    return projectResource;
  });