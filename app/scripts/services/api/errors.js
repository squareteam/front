'use strict';

angular.module('squareteam.app')
  .factory('ApiErrors', function Apierrors() {
    
    //////////////////////////////
    // Error(s) returned by API //
    //////////////////////////////
    function ApiErrors (errors) {
      this.errors = errors;
    }

    angular.extend(ApiErrors.prototype, {
      toString    : function() {
        return 'ApiError : ' + this.errors.join(', ');
      },

      getErrors   : function() {
        return this.errors;
      }
    });

    ////////////////
    // Http Error //
    ////////////////
    function HttpError (status, message) {
      this.status   = status;
      this.message  = message;
    }

    angular.extend(HttpError.prototype, {
      toString    : function() {
        return 'HttpError(' + this.status + '): ' + this.message;
      }
    });

    return {
      Api   : ApiErrors,
      Http  : HttpError
    };
  });
