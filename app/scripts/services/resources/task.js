'use strict';

angular.module('squareteam.resources')
  .factory('TaskResource', function(restmod) {
    return restmod.model('apis://tasks', 'AclModel');
  });