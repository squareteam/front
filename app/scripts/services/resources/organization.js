'use strict';

angular.module('squareteam.resources')
  .factory('OrganizationResource', function($resource, $q, $http) {
    var organizationResource;

    organizationResource = $resource('apis://organizations/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    organizationResource.createWithAdmins = function (organizationData, adminIds) {
      /*jshint camelcase:false */
      organizationData.admins_ids = adminIds;
      /*jshint camelcase:true */
      return $http.post('apis://organizations/with_admins', organizationData);
    };

    organizationResource.teams = $resource('apis://organizations/:id/teams');

    return organizationResource;
  });