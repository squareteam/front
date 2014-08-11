'use strict';

angular.module('squareteam.app')
   .service('PasswordConfirmPopin', function($rootScope, $q, ngDialog) {

    this.prompt = function() {
      var dialog,
          deferred = $q.defer(),
          scope = $rootScope.$new();

      scope.confirm = function() {
        deferred.resolve(scope.password);
        dialog.close();
      };

      dialog = ngDialog.open({
        template  : 'views/app/password_confirm_popin.html',
        scope     : scope
      });

      dialog.closePromise.then(deferred.reject);

      return deferred.promise;
    };

  });