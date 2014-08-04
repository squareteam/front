'use strict';

// Organization creation form
// 
//  - forUsers      : users to add to newly created organization,
//                    should be an array of integers (default: undefined)
//  - redirectPath  : path to redirect to if organization created successfully
//  
// FIXME(charly) : forUsers should be a array of object like : [{ id : 1 , admin : true }, ...]

angular.module('squareteam.app')
  .directive('stOrganizationCreate', function () {
    return {
      scope: {
        forUsers : '=',
        redirectPath : '@'
      },
      templateUrl: 'scripts/directives/templates/storganizationcreate.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, $http, $state, OrganizationResource, ApiErrors) {

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


          OrganizationResource.createWithAdmins($scope.organization, $scope.forUsers || []).then(function(response) {
            if ($scope.redirectPath ) {
              $location.path($scope.redirectPath);
            } else {
              $state.go('app.organization.manage', { organizationId : response.data.id });
            }
          }, onError);

        };
      }
    };
  });