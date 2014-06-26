'use strict';

angular.module('squareteam.ressources')
  .factory('OrganizationRessource', function($resource/*, $q, $http*/) {
    var organizationRessource;

    organizationRessource = $resource('apis://organizations/:id', {
      // id: '@'
    }, {
      update: {
        method: 'PUT'
      }
    });

    // organizationRessource.create = function(organizationData, userData) {
    //   var defer = $q.defer();


    //   organizationRessource.save({}, organizationData, function() {
    //     organizationRessource.getTeams(function(teams) {

          


    //     }, defer.reject);
    //   }, defer.reject);

    //   return defer.promise;
    // };

    organizationRessource.getTeams = $resource('apis://organizations/:id/teams');

    return organizationRessource;
  });