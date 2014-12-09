'use strict';

angular.module('squareteam.resources')
  .factory('ProjectMissionResource', function(restmod) {
    return restmod.model('apis://missions', 'AclModel');
  });