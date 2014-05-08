'use strict';

angular.module('squareteam.app')
  .directive('stOrganizationCreate', function () {
    return {
      scope: {
        forUser : '@',
        membersChooser : '@',
        redirectTo : '@'
      },
      templateUrl: 'scripts/directives/templates/storganizationcreate.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, UserRessource) {
        $scope.create = function() {

          UserRessource.organizations.save({}, $scope.organization, function() {
            $location.path($scope.redirectTo);
          }, function() {

          });
        };
      }
    };
  });