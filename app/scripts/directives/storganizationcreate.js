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

            if ($scope.forUsers && $scope.forUsers.length) {
              // API DO NOT SUPPORT BATCH FOR NOW..
              // 
              // $.map($scope.forUsers, function(userId) {
              //   return {
              //     'organization_id' : organization.id,
              //     'user_id' : userId,
              //     'admin'   : 1
              //   };
              // }.bind(this))
              var data = {
                'organization_id' : organization.id,
                'user_id' : $scope.forUsers[0],
                'admin'   : 1
              };
              $http.post('apis://members', data).then(function() {
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