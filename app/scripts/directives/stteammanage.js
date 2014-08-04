/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stTeamManage', function () {
    return {
      scope: {
        teamId      : '@'
      },
      templateUrl: 'scripts/directives/templates/stteammanage.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $state, TeamResource) {
        
        $scope.$setPristine = function() {
          $scope.errors = {
            loadTeam    : false,
            removeUsers : false,
            addUser     : false,
            updateUser  : false
          };
        };

        $scope.$setPristine();

        // Load team

        TeamResource.load($scope.teamId).then(function(team) {
          $scope.team = team;
        }, function() {
          $scope.errors.loadTeam = true;
        });

        // Logic

        var usersToRemove = [];

        function toggleUserRemoveFromTeam (user) {
          var index = usersToRemove.indexOf(user.id);

          if (index === -1) {
            usersToRemove.push(user.id);
          } else {
            usersToRemove.splice(index, 1);
          }
        }

        function addUserToTeam (user) {
          $scope.$setPristine();
          $scope.team.addUser(user).catch(function() {
            $scope.errors.addUser = true;
          });
        }

        // TODO(charly): batch remove ?
        function removeUsers () {
          $scope.$setPristine();
          if (usersToRemove.length) {
            angular.forEach(usersToRemove, function(userId) {
              $scope.team.removeUser(userId).catch(function() {
                $scope.errors.removeUsers = true;
              });
            });
          }
        }

        function updateUserRole () {
          if ($scope.currentEditingUser) {
            $scope.team.updateUserRole($scope.currentEditingUser.id, $scope.roleToAdd).then(function() {
              $scope.currentEditingUser = false;
            }, function() {
              $scope.errors.updateUser = true;
            });
          }
        }

        $scope.roleToAdd    = 0;
        $scope.currentEditingUser = false;

        // EXPOSE to $scope
        $scope.toggleUserRemoveFromTeam  = toggleUserRemoveFromTeam;
        $scope.addUserToTeam             = addUserToTeam;
        $scope.removeUsers               = removeUsers;
        $scope.updateUserRole            = updateUserRole;
        $scope.editUserPermission        = function(user) {
          $scope.currentEditingUser = user;
          $scope.roleToAdd          = user.permissions;
        };

        $scope.usersIds                  = function() {
          return $scope.team ? $.map($scope.team.users, function(user) {
            return user.id;
          }) : [];
        };

        $scope.rolesHelpers              = TeamResource.rolesHelpers;

        $scope.usersToRemove             = usersToRemove;
        $scope.ROLES                     = TeamResource.ROLES;
      }
    };
  });
