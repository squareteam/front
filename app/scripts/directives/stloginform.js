'use strict';

// stLoginFormDirective display a form for login
// 
// - redirectPath : path to redirect to if succeed (default: "app.home")
// - githubLogin  : show login via github button (default: false)

angular.module('squareteam.app')
  .directive('stLoginForm', function () {
    return {
      templateUrl: 'scripts/directives/templates/stloginform.html',
      restrict: 'E',
      scope : {
        redirectPath  : '@',
        githubLogin   : '@'
      },
      replace : true,
      controller: function($scope, $element, $attrs, $state, ApiSession, appConfig) {

        $scope.retries = 0;

        $scope.githubLoginUrl = appConfig.api.oauth.github.loginUrl;

        $scope.login = function() {
          
          $scope.loginForm.email.$setValidity('valid', true);
          $scope.loginForm.password.$setValidity('valid', true);
          $scope.serverBusy = false;
          
          ApiSession.login($scope.user.email, $scope.user.password).then(function() {
            $state.go($scope.redirectPath || 'app.home');
          }, function(error) {
            if (error === 'auth.bad_login') {
              $scope.retries++;
              $scope.loginForm.email.$setValidity('valid', false);
            } else if (error === 'auth.bad_password') {
              $scope.retries++;
              $scope.loginForm.password.$setValidity('valid', false);
            } else {
              $scope.serverBusy = true;
            }
          });
        };
      }
    };
  });
