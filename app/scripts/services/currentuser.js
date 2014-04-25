'use strict';

angular.module('squareteam.app')
  .factory('Currentuser', function Currentuser() {
    var currentUser = null, currentAuth = {
      'identifier'  : 'anonymous',
      'token'       : ''
    };

    return {
      getUser : function() {
        return currentUser;
      },

      setUser : function(user) {
        currentUser = user;
      },

      setAuth : function(auth) {
        currentAuth = auth;
      },

      getAuth : function() {
        return currentAuth;
      },

      getAll  : function() {
        return {
          auth : currentAuth,
          user : currentUser
        };
      }
    };
  });
