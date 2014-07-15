'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function($resource) {
    var projectResource;

    projectResource = $resource('apis://projects/:id', {}, {
      update: {
        method: 'PUT'
      }
    });

    return projectResource;
  });