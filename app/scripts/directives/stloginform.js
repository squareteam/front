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
        githubLogin   : '@',
        googleLogin   : '@'
      },
      replace : true,
      controller: function($scope, $element, $attrs, $state, $location, ApiSession, ApiOAuth) {

        $scope.retries = 0;

        if (ApiOAuth.isOAuthLoginRequest()) {
          var oAuthParams = ApiOAuth.oAuthLoginData();

          if (oAuthParams.provider && oAuthParams.email && oAuthParams.provider.toLowerCase() === 'squareteam') {
            $scope.user = {
              email : oAuthParams.email
            };
            $scope.youAlreadyHaveAccount = true;
          }
        }

        $scope.setDirty = function() {
          // set all inputs to dirty
          angular.forEach(['email', 'password'], function(input) {
            var i = $scope.loginForm[input];
            i.$setViewValue(i.$viewValue);
          });
        };

        $scope.login = function() {
          
          $scope.loginForm.email.$setValidity('valid', true);
          $scope.loginForm.password.$setValidity('valid', true);
          $scope.serverBusy             = false;
          $scope.youAlreadyHaveAccount  = false;
          
          ApiSession.login($scope.user.email, $scope.user.password).then(function() {
            $state.go($scope.redirectPath || 'app.home');
          }, function(error) {
            $scope.retries++;
            if (error === 'auth.bad_login') {
              $scope.loginForm.email.$setValidity('valid', false);
            } else if (error === 'auth.bad_password') {
              $scope.loginForm.password.$setValidity('valid', false);
            } else {
              $scope.serverBusy = true;
            }
          });
        };
      },

      link : function(scope, iElement) {
        angular.forEach(iElement.find('input'), function(element) {
          element.addEventListener('invalid', function(e) {
            e.preventDefault();
          }, true);
        });
      }
    };
  });
