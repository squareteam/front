'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function(restmod) {
    return restmod.model({
      url      : null,
      name     : 'projects',
    }, 'AclModel', function() {

      this.attrMask('status', 'C');
      this.attrMask('metadata', 'CU');
      this.attrMask('progress', 'CU');
      this.attrMask('creator', 'CU');
      this.attrMask('users', 'CU');
      this.attrMask('createdAt', 'CU');
      this.attrMask('id', 'CU');

      this.attrEncoder('deadline', function(value) {
        return value === null ? '' : value;
      });

      this.attrDecoder('progress', function(value) {
        return value + '%';
      });
    });
  });