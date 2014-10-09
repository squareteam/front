'use strict';

angular.module('squareteam.app')
  .controller('ManageOrganizationCtrl', function ($scope, $state, $q, $http, OrganizationResource, TeamResource, currentOrganization, ngDialog) {

    $scope.editingUsers = [];
    $scope.team         = null;

    $scope.organization = OrganizationResource.$find(currentOrganization.id).$then(function() {

      $scope.organization.teams.$fetch().$then(function(teams) {
        $scope.teams = teams;
      });

      $scope.manageTeam = function(team) {
        $scope.team = team;
        $scope.editingUsers = [];
      };

      $scope.openPopin = function(mode) {
        var dialog,
            popinScope = $scope.$new();

        popinScope.mode = mode;
        popinScope.Team = TeamResource;
        popinScope.team = mode === 'create' ? $scope.organization.teams.$buildRaw({}) : $scope.team;

        popinScope.save = function() {
          popinScope.team.$save().$then(function() {
            var updates = [];

            angular.forEach(popinScope.teamUsersDiff.added, function(user) {
              updates.push(popinScope.team.users.$create({
                'id'          : user.id,
                'user_id'     : user.id,
                'permissions' : 0,
                'name'        : user.name
              }).$promise);
            });

            angular.forEach(popinScope.teamUsersDiff.deleted, function(user) {
              updates.push(user.$destroy().$promise);
            });

            $q.all(updates).then(dialog.close);
          });
        };

        dialog = ngDialog.open({
          template  : 'views/app/manage/organization/popins/team.html',
          scope     : popinScope
        });
      };

      $scope.updateUser = function(user) {
        $http.put('apis://teams/' + $scope.team.id + '/users/' + user.id, {
          permissions : user.permissions
        }).then(function() {
          $scope.stopEditUser(user);
        });
      };

      $scope.removeUser = function(user) {
        $http.delete('apis://teams/' + $scope.team.id + '/users/' + user.id).then(function() {
          $scope.team.users.$remove(user);
        });
      };

      $scope.isEditing = function(user) {
        return $scope.editingUsers.indexOf(user.id) > -1;
      };

      $scope.stopEditUser = function(user) {
        var index = $scope.editingUsers.indexOf(user.id);

        if (index > -1) {
          $scope.editingUsers.splice(index, 1);
        }
      };

    });
  });
