'use strict';

angular.module('squareteam.app')
  .directive('stOrganizationCreate', function () {
    return {
      scope: {
        forUser : '@',
        membersChooser : '@',
        redirectPath : '@'
      },
      templateUrl: 'scripts/directives/templates/storganizationcreate.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, $http, OrganizationRessource, ApiErrors) {

        function onError (response) {
          if (response.error instanceof ApiErrors.Api) {
            angular.forEach(response.error.getErrors(), function(errorText) {
              if (errorText === 'Name has already been taken') {
                $scope.createOrganizationForm.name.$setValidity('unique', false);
              }
            });
          } else {
            $scope.serverBusy = true;
          }
        }

        $scope.create = function() {
          $scope.serverBusy = false;
          $scope.createOrganizationForm.name.$setValidity('unique', true);

          var organization = OrganizationRessource.save({}, $scope.organization, function() {
            function redirectOnFinish () {
              $location.path($scope.redirectPath || '/home');
            }

            if ($scope.forUser) {
              $http.post('apis://members', {
                'organization_id' : organization.id,
                'user_id' : $scope.forUser,
                'admin'   : 1
              }).then(function() {
                redirectOnFinish();
              }, onError);
            } else {
              redirectOnFinish();
            }
          },onError);
        };
      }
    };
  });