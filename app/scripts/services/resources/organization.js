'use strict';

angular.module('squareteam.resources')
  .factory('OrganizationResource', function($resource, $q, $http, $cacheFactory) {
    var organizationResource;

    organizationResource = $resource('apis://organizations/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    // organizationResource.create = function(organizationData, userData) {
    //   var defer = $q.defer();


    //   organizationResource.save({}, organizationData, function() {
    //     organizationResource.getTeams(function(teams) {

          


    //     }, defer.reject);
    //   }, defer.reject);

    //   return defer.promise;
    // };
    
    organizationResource.createWithAdmins = function (organizationData, adminIds) {
      organizationData.admins = adminIds;
      return $http.post('apis://organizations/with_admins', organizationData);
    };

    organizationResource.getTeams = $resource('apis://organizations/:id/teams');

    organizationResource.projects = function (organizationId) {
      return $http.get('apis://organizations/' + organizationId + '/projects', {
        cache : $cacheFactory('projects')
      });
    };

    return organizationResource;
  });