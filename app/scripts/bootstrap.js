'use strict';

angular.module('squareteam.app').run(function(ApiSession) {

  ApiSession.restore().then(function(errorIfAny) {
    if (errorIfAny && errorIfAny === 'auth.invalid') {
      // redirect to login page with flash message
    }
  }.bind(this));

});