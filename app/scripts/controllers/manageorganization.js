'use strict';

angular.module('squareteam.app')
  .controller('ManageOrganizationCtrl', function ($scope, $state, OrganizationResource, currentOrganization) {

    var organization;

    organization = OrganizationResource.$find(currentOrganization.id).$then(function() {

      $scope.organization = organization;

      organization.teams.$fetch().$then(function(teams) {
        $scope.teams = teams;
      });

      $scope.createTeam = function(name) {
        var team = organization.teams.$build({
          name : name
        });

        team.$save().$then(function(data) {
          $state.go('app.organization.team', { teamId : data.id, organizationId : currentOrganization.id });
        }, function() {
          window.alert('error while creating team');
        });
      };

    });
  });
