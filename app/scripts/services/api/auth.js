'use strict';

// **Class**
// 
// Represent a auth with couple(token, identifier)
// 
//  `$isValid` method return if token is a CryptoJS.WordArray and idenfitier is not empty or null

angular.module('squareteam.api')
  .factory('ApiAuth', function Apiauth() {
    return function(identifier, token) {
      this.token                  = token;
      this.identifier             = identifier;

      this.$isValid = function() {
        return !!this.token && !!this.token.words && !!this.token.sigBytes && !!this.identifier;
      };

    };
  });
