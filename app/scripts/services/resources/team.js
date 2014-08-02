'use strict';

angular.module('squareteam.resources')
  .factory('TeamResource', function($resource, $http, $q) {
    var TeamResource, ROLES;

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

    TeamResource = $resource('apis://teams/:id', {}, {
      update: {
        method: 'PUT'
      }
    });


    function Team (data) {
      angular.forEach(data, function(value, key) {
        this[key] = value;
      }, this);
    }

    Team.prototype = {

      addUser : function(user) {
        var defer = $q.defer();

        $http.post('apis://team/'+ this.id + '/user', {
          'user_id'     : user.id,
          'permissions' : 0
        }).then(angular.bind(this, function() {
          this.users.push(user);
          defer.resolve(user);
        }), defer.reject);

        return defer.promise;
      },

      updateUserRole : function(userId, permissions) {
        var defer = $q.defer();

        $http.put('apis://team/'+ this.id + '/user/' + userId, {
          'permissions' : permissions
        }).then(angular.bind(this, function() {
          defer.resolve();
        }), defer.reject);

        return defer.promise;
      },

      removeUser : function(userId) {
        var defer = $q.defer(),
            index = -1;

        angular.forEach(this.users, function(user, i) {
          if (user.id === userId) {
            index = i;
          }
        });

        if (index >= 0) {
          $http['delete']('apis://team/'+ this.id + '/user/' + userId).then(angular.bind(this, function() {
            this.users.splice(index, 1);
            defer.resolve();
          }), defer.reject);
        } else {
          defer.reject();
        }

        return defer.promise;
      }

    };


    function getTeam (id) {
      var defer = $q.defer();

      $http.get('apis://teams/'+ id).then(function(response) {
        defer.resolve(new Team(response.data));
      }, defer.reject);

      return defer.promise;
    }

    return {
      load    : getTeam,
      get     : TeamResource.get,
      query   : TeamResource.query,
      remove  : TeamResource.remove,
      update  : TeamResource.update,

      // Roles logic

      ROLES   : ROLES,

      /*jshint bitwise: false*/
      rolesHelpers : {
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
          angular.forEach(ROLES, function(value) {
            permissions = permissions | value;
          });
          return permissions;
        }
      }
    };
  });