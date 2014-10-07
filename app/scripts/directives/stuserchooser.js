/* globals $ */

'use strict';

angular.module('squareteam.app')
  .directive('stUserChooser', function () {
    return {
      templateUrl: 'scripts/directives/templates/stuserchooser.html',
      restrict: 'E',
      replace: true,
      scope : {
        referential   : '=',
        differential  : '='
      },
      controller : function($scope, $element, $attrs, UserResource, _) {

        $scope.selectedUsers = angular.copy($scope.referential);

        $scope.$watch('search', function(search) {
          if ($.trim(search).length) {
            UserResource.search(search).then(function(response) {
              $scope.resultUsers = response.data;
              $scope.refreshList();
            });
          } else {
            $scope.users = [];
            $scope.users = $scope.users.concat($scope.selectedUsers);
          }
        });

        $scope.refreshList = function() {
          $scope.users = [];
          $scope.users = $scope.users.concat($scope.resultUsers || []);
          $scope.users = $scope.users.concat($scope.selectedUsers || []);
          $scope.users = _.uniq($scope.users, 'id');
        };

        $scope.toggleSelection = function(user) {
          var userIndex = $scope.selectUserIndex(user);
          if (userIndex > -1) {
            $scope.selectedUsers.splice(userIndex, 1);
          } else {
            $scope.selectedUsers.push(user);
          }
        };

        $scope.isSelected = function(user) {
          return $scope.selectUserIndex(user) > -1;
        };

        $scope.selectUserIndex = function(user) {
          return _.findIndex($scope.selectedUsers, { 'id': user.id });
        };

        $scope.$watchCollection('selectedUsers', function() {
          $scope.refreshList();
          $scope.differential = {
            deleted : [],
            added   : []
          };

          angular.forEach($scope.selectedUsers, function(user) {
            if (!_.find($scope.referential, { 'id' : user.id })) {
              $scope.differential.added.push(user);
            }
          });

          angular.forEach($scope.referential, function(user) {
            if (!_.find($scope.selectedUsers, { 'id' : user.id })) {
              $scope.differential.deleted.push(user);
            }
          });
        });
      },
      link: function postLink(scope, element) {

        $(element).find('.search').on('keydown', function(e) {
          if (e.keyCode === 27) {
            e.stopImmediatePropagation();
            e.preventDefault();
            scope.search = '';
            scope.$apply();
            return false;
          }
        });

      }
    };
  });
