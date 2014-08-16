'use strict';

angular.module('squareteam.resources')
  .factory('KnowledgeResource', function(restmod) {
    return restmod.model('apis://knowledges');
  });