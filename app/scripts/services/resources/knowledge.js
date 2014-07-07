'use strict';

angular.module('squareteam.resources')
  .factory('KnowledgeResource', function($resource) {
    var knowledgeResource;

    knowledgeResource = $resource('apis://knowledges/:id', {}, {
      update: {
        method: 'PUT'
      }
    });

    return knowledgeResource;
  });