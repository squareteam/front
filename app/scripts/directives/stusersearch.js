/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stUserSearch', function () {
    return {
      templateUrl: 'scripts/directives/templates/stusersearch.html',
      restrict: 'E',
      scope : {
        'onSelect'        : '&',
        'exclude'         : '@', // user ids to exclude
        'forOrganization' : '@', // restrict search scope (TODO)
        'forTeam'         : '@'  // restrict search scope (TODO)
      },
      replace: true,
      controller: function($scope, $element, $attrs, UserResource) {
        $scope.users = [];
        $scope.search = function() {
          // exclude is evaluated at each search
          var exclude = $scope.exclude ? $scope.exclude : [];

          if ($.trim($scope.query).length) {
            UserResource.search($scope.query).then(function(response) {
              $scope.users = $.grep(response.data, function(user) {
                return exclude.indexOf(user.id) === -1;
              });
            }, function() {
              // do what ?
            });
          }
        };
      }
    };
  });
