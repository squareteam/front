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

    organizationRessource.members = $resource('apis://organizations/:org_id/members/:id', {});

    return organizationRessource;
  });