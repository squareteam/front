'use strict';

angular.module('squareteam.app')
  .controller('ManageOrganizationCtrl', function ($scope, $state, OrganizationResource, currentOrganization) {

    $scope.organization = currentOrganization;

    OrganizationResource.teams.query({
      id : currentOrganization.id
    }, function(teams) {
      $scope.teams = teams;
    });

    $scope.createTeam = function(name) {
      OrganizationResource.teams.save({
        id :currentOrganization.id
      },{
        name : name
      }, function(data) {
        $state.go('app.organization.team', { teamId : data.id, organizationId : currentOrganization.id });
      }, function() {
        window.alert('error while creating team');
      });
    };
  });
