/* global $ */

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
          if ($.trim($scope.query).length) {
            UserResource.search($scope.query).then(function(response) {
              $scope.users = response.data;
            }, function() {
              // do what ?
            });
          }
        };
      }
    };
  });
