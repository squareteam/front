'use strict';

angular.module('squareteam.app')
  .directive('stLoginForm', function () {
    return {
      templateUrl: 'scripts/directives/templates/stloginform.html',
      restrict: 'E',
      scope : {
        redirectPath : '@'
      },
      replace : true,
      controller: function($scope, $element, $attrs, $state, ApiSession) {

        $scope.login = function() {
          
          $scope.loginForm.email.$setValidity('valid', true);
          $scope.loginForm.password.$setValidity('valid', true);
          $scope.serverBusy = false;
          
          ApiSession.login($scope.user.email, $scope.user.password).then(function() {
            $state.go($scope.redirectPath || 'app.home');
          }, function(error) {
            if (error === 'auth.bad_login') {
              $scope.loginForm.email.$setValidity('valid', false);
            } else if (error === 'auth.bad_password') {
              $scope.loginForm.password.$setValidity('valid', false);
            } else {
              $scope.serverBusy = true;
            }
          });
        };
      }
    };
  });
