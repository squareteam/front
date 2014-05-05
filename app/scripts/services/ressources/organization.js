'use strict';

angular.module('squareteam.ressources')
  .factory('OrganizationRessource', function($resource) {
    var organizationRessource;

    organizationRessource = $resource('apis://organizations/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return organizationRessource;
  });