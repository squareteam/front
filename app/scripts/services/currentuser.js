'use strict';

angular.module('squareteam.app')
  .factory('Currentuser', function Currentuser(ApiAuth) {
    var currentUser = null, currentAuth = new ApiAuth();

    return {
      isAuthenticated : function() {
        return currentAuth.isValidatedFromServer();
      },

      getUser : function() {
        return currentUser;
      },

      setUser : function(user) {
        currentUser = user;
      },

      // Setting `validatedFromServer` to `true` ensure that provided auth
      // has been validated by the api
      setAuth : function(auth, validatedFromServer) {
        currentAuth = auth;
        if (validatedFromServer === true) {
          currentAuth.$$validatedFromServer = true;
        }
      },

      getAuth : function() {
        return currentAuth;
      }
    };
  });
