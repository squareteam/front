'use strict';

angular.module('squareteam.resources')
  .factory('MissionResource', function($resource) {
    var missionResource;

    missionResource = $resource('apis://missions/:id', {}, {
      update: {
        method: 'PUT'
      }
    });

    return missionResource;
  });