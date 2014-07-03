'use strict';

angular.module('squareteam.resources')
  .factory('OrganizationResource', function($resource/*, $q, $http*/) {
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

    organizationResource.getTeams = $resource('apis://organizations/:id/teams');

    return organizationResource;
  });