'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResourceNested', function(restmod, ProjectResourceConfig) {
    return restmod.model({
      url      : null,
      name     : 'projects',
    }, 'AclModel', ProjectResourceConfig);
  });