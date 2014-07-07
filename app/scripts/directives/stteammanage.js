'use strict';

angular.module('squareteam.app')
  .directive('stTeamManage', function () {
    return {
      scope: {
        teamId      : '@',
        canDestroy  : '@'
      },
      templateUrl: 'scripts/directives/templates/stteammanage.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $state, TeamResource) {
        
        $scope.$setPristine = function() {
          $scope.errors = {
            loadTeam    : false,
            removeUsers : false,
            addUser     : false
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

        function destroyTeam () {
          TeamResource.remove({ id : $scope.teamId }, function() {
            $state.go('app.organizations');
          }, function() {
            // TODO(charly): show error
          });
        }

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
          if ($scope.editUserRole) {
            $scope.team.updateUserRole($scope.editUserRole.id, $scope.roleToAdd).then(function() {
              $scope.editUserRole = false;
            }, function() {
              // display error
            });
          }
        }

        $scope.roleToAdd    = 0;
        $scope.editUserRole = false;

        // EXPOSE to $scope
        $scope.toggleUserRemoveFromTeam  = toggleUserRemoveFromTeam;
        $scope.addUserToTeam             = addUserToTeam;
        $scope.removeUsers               = removeUsers;
        $scope.destroyTeam               = destroyTeam;
        $scope.updateUserRole            = updateUserRole;

        $scope.rolesHelpers              = TeamResource.rolesHelpers;

        $scope.usersToRemove             = usersToRemove;
        $scope.ROLES                     = TeamResource.ROLES;
      }
    };
  });
