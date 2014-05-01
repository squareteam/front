'use strict';

angular.module('squareteam.app')
  .directive('stLoginForm', function () {
    return {
      templateUrl: 'scripts/directives/templates/stloginform.html',
      restrict: 'E',
      scope : {
        redirectUrl : '@'
      },
      // replace : true,
      controller: function($scope, $element, $attrs, $location, ApiSession) {
        $scope.session = ApiSession;

        $scope.login = function() {
          console.log($scope);

          ApiSession.login($scope.user.login, $scope.user.password).then(function() {
            $location.path($scope.redirectUrl || '/home');
          }, function(error) {
            if (error === 'auth.bad_login') {
              $scope.errors = 'Le login n\'est pas valide';
            } else if (error === 'auth.bad_password') {
              $scope.errors = 'Le mot de passe n\'est pas valide';
            } else {
              $scope.errors = 'Le serveur est indisponible';
            }
          });
        };
      }
    };
  });
