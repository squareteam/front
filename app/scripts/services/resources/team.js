'use strict';

angular.module('squareteam.resources')
  .factory('TeamResource', function($resource, $http, $q, restmod) {
    var model,ROLES;

    ROLES = {
      MANAGE_TEAM           : 0x01,
      ADD_PROJECT           : 0x02,
      MANAGE_PROJECTS       : 0x04,
      ADD_TASK              : 0x08,
      MANAGE_TASKS          : 0x10,
      ADD_MISSION           : 0x20,
      MANAGE_ORGANIZATION   : 0x40,
      MANAGE_MISSION        : 0x80
    };

    model = restmod.model('apis://teams', {
      users : { hasMany : restmod.model(null) }
    });

    model.ROLES = ROLES;

      /*jshint bitwise: false*/
    model.rolesHelpers = {
      add : function(permissions, role) {
        return (permissions & role);
      },

      has : function(permissions, role) {
        return (((permissions & role) === role) && permissions !== 0 );
      },

      remove : function(permissions, role) {
        return (permissions & (~role));
      },

      all : function() {
        var permissions = 0;
        angular.forEach(ROLES, function(value) {
          permissions = permissions & value;
        });
        return permissions;
      }
    };
    /*jshint bitwise: true*/
    return model;
  });

