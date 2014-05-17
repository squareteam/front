'use strict';

angular.module('squareteam.app')
  .service('Currentuser', function Currentuser(ApiAuth) {
    this.$$user                 = null;
    this.$$auth                 = new ApiAuth();
    this.$$currentOrganization  = null;
    this.$$organizations        = [];
    
    this.isAuthenticated = function() {
      return this.$$auth.isValidatedFromServer();
    };

    this.getCurrentOrganization = function() {
      return this.$$currentOrganization;
    };

    this.setCurrentOrganization = function(organization) {
      this.$$currentOrganization = organization;
    };

    this.setOrganizations = function(organizations) {
      this.$$organizations = organizations;
      this.setCurrentOrganization(organizations[0]);
    };

    this.getOrganizations = function() {
      return this.$$organizations;
    };

    this.getUser = function() {
      return this.$$user;
    };

    this.setUser = function(user) {
      this.$$user = user;
    };

      // Setting `validatedFromServer` to `true` ensure that provided auth
      // has been validated by the api
    this.setAuth = function(auth, validatedFromServer) {
      this.$$auth = auth;
      if (validatedFromServer === true) {
        this.$$auth.$$validatedFromServer = true;
      }
    };

    this.getAuth = function() {
      return this.$$auth;
    };

  });
