'use strict';

angular.module('squareteam.app')
  .directive('stUserSearch', function () {
    return {
      templateUrl: 'scripts/directives/templates/stusersearch.html',
      restrict: 'E',
      scope : {
        'onSelect' : '&'
      },
      replace: true,
      controller: function($scope, $element, $attrs, UserResource) {
        $scope.users = [];
        $scope.search = function() {
          UserResource.search($scope.query).then(function(response) {
            $scope.users = response.data;
          }, function() {
            // do what ?
          });
        };
      }
    };
  });
