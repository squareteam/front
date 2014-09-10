'use strict';

angular.module('squareteam.resources')
  .factory('AclRoles', function() {

    var ROLES = {
      MANAGE_TEAM           : 0x01,
      ADD_PROJECT           : 0x02,
      MANAGE_PROJECTS       : 0x04,
      ADD_TASK              : 0x08,
      MANAGE_TASKS          : 0x10,
      ADD_MISSION           : 0x20,
      MANAGE_ORGANIZATION   : 0x40,
      MANAGE_MISSION        : 0x80
    };

    return {
      ROLES : ROLES,

      asBooleanMap : function(permissions) {
        return {
          organizations: {
            manage : this.has(permissions, ROLES.MANAGE_ORGANIZATION)
          },
          teams: {
            manage : this.has(permissions, ROLES.MANAGE_TEAM)
          },
          projects: {
            manage  : this.has(permissions, ROLES.MANAGE_PROJECTS),
            add     : this.has(permissions, ROLES.ADD_PROJECT)
          },
          missions : {
            manage  : this.has(permissions, ROLES.MANAGE_MISSION),
            add     : this.has(permissions, ROLES.ADD_MISSION)
          },
          tasks: {
            manage  : this.has(permissions, ROLES.MANAGE_TASKS),
            add     : this.has(permissions, ROLES.ADD_TASK)
          }
        };
      },

      /*jshint bitwise: false*/
      add : function(permissions, role) {
        return (permissions | role);
      },

      has : function(permissions, role) {
        return (((permissions & role) === role) && permissions !== 0 );
      },

      remove : function(permissions, role) {
        return (permissions & (~role));
      },

      all : function() {
        var permissions = 0;
        // TODO(charly): use Array.reduce !
        angular.forEach(ROLES, function(value) {
          permissions = permissions | value;
        });
        return permissions;
      }
      /*jshint bitwise: true*/

    };

  });