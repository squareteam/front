'use strict';

angular.module('squareteam.resources')
  .factory('AclModel', function(restmod, CurrentSession) {

    return restmod.mixin(function() {

      // TODO(charly): to improve perf, fetch orga_id on after-feed and store it !

      /**
       * Add a $can() method for ACL
       *
       * @param  {String} action 'manage' or 'create'
       * @return {Boolean}
       */
      this.define('$can', function(action) {

        var organizationId  = false,
            scope           = this.$scope;

        if (this.constructor.$name() === 'organizations') {
          organizationId = this.id;
        } else {
          do {

            if (scope.constructor && scope.constructor.$name && scope.constructor.$name() === 'organizations') {
              organizationId = scope.id;
            }

          } while ((scope = scope.$scope) && !organizationId);
        }

        return CurrentSession.userCanDo(action, this.constructor.$name(), organizationId);

      });

    });

  });