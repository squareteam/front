'use strict';

angular.module('squareteam.resources')
  .factory('ModelHelpers', function(restmod) {

    return restmod.mixin(function() {

      /**
       * Return closest parent by name (or name range)
       *
       * @param  {String|Array} parent model name(s)
       * @return {Model|Null}
       */
      this.define('$closestParentByName', function(names) {

        var parent = null,
            modelScope = this;

        if (!angular.isArray(names)) {
          names = [names];
        }

        do {

          if (modelScope.constructor && modelScope.constructor.$name && names.indexOf(modelScope.constructor.$name()) > -1) {
            parent = modelScope;
          }

        } while ((modelScope = modelScope.$scope) && !parent);

        return parent;

      });

    });

  });