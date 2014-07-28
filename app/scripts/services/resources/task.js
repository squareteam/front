'use strict';

angular.module('squareteam.resources')
  .factory('TaskResource', function($resource) {
    var taskResource;

    taskResource = $resource('apis://tasks/:id', {}, {
      update: {
        method: 'PUT'
      }
    });

    return taskResource;
  });