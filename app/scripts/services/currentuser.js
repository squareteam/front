'use strict';

angular.module('squareteam.app')
  .factory('Currentuser', function Currentuser(ApiAuth) {
    var currentUser = null, currentAuth = new ApiAuth();

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
      }
    };
  });
