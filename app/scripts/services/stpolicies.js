'use strict';

angular.module('squareteam.app')
  .service('stPolicies', function stPolicies() {
    return {

      REGEXP : {
        password : new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
      },

      isPasswordValid : function(password) {
        return !!password && password.match(this.REGEXP.password) !== null;
      }
    };
  });