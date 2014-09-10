'use strict';

angular.module('squareteam.resources')
  .factory('MissionResource', function(restmod) {
    return restmod.model('apis://missions', 'AclModel');
  });