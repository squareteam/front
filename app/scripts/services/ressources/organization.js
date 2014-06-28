'use strict';

angular.module('squareteam.ressources')
  .factory('OrganizationRessource', function($resource, $http) {
    var organizationRessource;

    organizationRessource = $resource('apis://organizations/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    organizationRessource.createWithAdmins = function (organizationData, adminIds) {
      organizationData.admins = adminIds;
      return $http.post('apis://organizations/with_admins', organizationData);
    };

    organizationRessource.getTeams = $resource('apis://organizations/:id/teams');

    return organizationRessource;
  });