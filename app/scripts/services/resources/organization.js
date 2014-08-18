'use strict';

angular.module('squareteam.resources')
  .factory('OrganizationResource', function($resource, $q, $http, restmod) {

    var Organization = restmod.model('apis://organizations', {

      teams     : { hasMany : 'TeamResource'},
      projects  : { hasMany : 'ProjectResource' }
    });

    Organization.createWithAdmins = function (organizationData, adminIds) {
      /*jshint camelcase:false */
      organizationData.admins_ids = adminIds;
      /*jshint camelcase:true */
      return $http.post('apis://organizations/with_admins', organizationData);
    };

    return Organization;
  });