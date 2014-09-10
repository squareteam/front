'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function(restmod) {
    return restmod.model({
      url      : null,
      name     : 'projects',
      deadline : {
        encode : function(value) {
          return value ? value : '';
        },
        chain: true
      }
    }, 'AclModel', function() {
      // TMP
      this.attrMask('status', 'CU');
      this.attrMask('metadata', 'CU');
      this.attrMask('progress', 'CU');
      this.attrMask('creator', 'CU');
      this.attrMask('users', 'CU');
    });
  });