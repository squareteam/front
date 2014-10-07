'use strict';

angular.module('squareteam.app')
  .directive('stUserAclEdit', function () {
    return {
      scope: {
        user   : '=',
        onSave : '&'
      },
      templateUrl: 'scripts/directives/templates/stuseracledit.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $state, $http, TeamResource, AclRoles) {

        $scope.$watch('roleToAdd', function (permissions) {
          if (angular.isNumber(permissions)) {
            $scope.user.permissions = permissions;
          }
        });

        // EXPOSE to $scope
        $scope.rolesHelpers              = AclRoles;
        $scope.ROLES                     = AclRoles.ROLES;

        $scope.$watch('user', function(user) {
          if (user && angular.isNumber(user.permissions)) {
            $scope.roleToAdd = user.permissions;
          }
        });
      }
    };
  });
