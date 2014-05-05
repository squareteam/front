'use strict';

angular.module('squareteam.app')
  .directive('stLoginForm', function () {
    return {
      templateUrl: 'scripts/directives/templates/stloginform.html',
      restrict: 'E',
      scope : {
        redirectUrl : '@'
      },
      replace : true,
      controller: function($scope, $element, $attrs, $location, ApiSession) {
        $scope.session = ApiSession;

        $scope.login = function() {
          
          $scope.loginForm.$setValidity('incorrect', true, 'email');
          $scope.loginForm.$setValidity('incorrect', true, 'password');
          $scope.serverBusy = false;
          
          ApiSession.login($scope.user.email, $scope.user.password).then(function() {
            $location.path($scope.redirectUrl || '/home');
          }, function(error) {
            if (error === 'auth.bad_login') {
              $scope.loginForm.$setValidity('incorrect', false, 'email');
            } else if (error === 'auth.bad_password') {
              $scope.loginForm.$setValidity('incorrect', false, 'password');
            } else {
              $scope.serverBusy = true;
            }
          });
        };
      }
    };
  });
