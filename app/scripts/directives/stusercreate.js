'use strict';

angular.module('squareteam.app')
  .directive('stUserCreate', function () {
    return {
      templateUrl: 'scripts/directives/templates/stusercreate.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, UserRessource, ApiErrors) {
        
        $scope.register = function() {

          $scope.registerForm.email.$setValidity('unique', true);
          $scope.serverBusy = false;

          UserRessource.create({
            name      : $scope.user.login,
            email     : $scope.user.email,
            password  : $scope.user.password
          }).then(function() {
            $location.path('/login');
          }, function(response) {
            if (response.error instanceof ApiErrors.Api) {
              angular.forEach(response.error.getErrors(), function(errorText) {
                if (errorText === 'Email has already been taken') {
                  $scope.registerForm.email.$setValidity('unique', false, 'email');
                }
              }.bind(this));
            } else {
              $scope.serverBusy = true;
            }
          });
        };
      }
    };
  });
