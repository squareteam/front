'use strict';

angular.module('squareteam.app')
  .factory('Currentuser', function Currentuser(ApiAuth) {
    var currentUser = null, currentAuth = new ApiAuth();

    this.$$currentOrganization = null;

    return {
      isAuthenticated : function() {
        return currentAuth.isValidatedFromServer();
      },

      getCurrentOrganization : function() {
        return this.$$currentOrganization;
      },

      setCurrentOrganization : function(organization) {
        this.$$currentOrganization = organization;
      },

      setOrganizations : function(organizations) {
        this.$$organizations = organizations;
        this.setCurrentOrganization(organizations[0]);
      },

      getOrganizations : function() {
        return this.$$organizations;
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
