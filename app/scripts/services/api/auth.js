'use strict';

angular.module('squareteam.api')
  .factory('ApiAuth', function Apiauth() {
    // Return class
    return function(identifier, token) {
      // token type should always be CryptoJS.WordArray
      this.token                  = token;
      this.identifier             = identifier;
      this.$$validatedFromServer  = false;

      this.$$isValid = function() {
        return !!this.token && !!this.token.words && !!this.token.sigBytes && !!this.identifier;
      };

      this.isValidatedFromServer = function() {
        return this.$$isValid && this.$$validatedFromServer;
      };

    };
  });
