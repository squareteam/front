/*global CryptoJS*/
'use strict';

// User creation form
//  User is automatically logged-in if creation succeed


angular.module('squareteam.app')
  .directive('stUserCreate', function () {
    return {
      templateUrl: 'scripts/directives/templates/stusercreate.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $location, UserRessource, ApiErrors, CurrentSession, ApiSession, ApiCrypto, ApiAuth) {
        
        $scope.setDirty = function() {
          // set all inputs to dirty
          angular.forEach(['email', 'password', 'confirmPassword', 'login', 'cgu'], function(input) {
            var i = $scope.registerForm[input];
            i.$setViewValue(i.$viewValue);
          });
        };

        $scope.passwordFormat = function() {
          $scope.passwordBadPractice = $scope.user.password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/) === null;
        };

        $scope.register = function() {

          $scope.registerForm.email.$setValidity('unique', true);
          $scope.serverBusy = false;

          UserRessource.create({
            name      : $scope.user.login,
            email     : $scope.user.email,
            password  : $scope.user.password
          }).then(function(response) {
            var token = ApiCrypto.generateToken(
                          $scope.user.email,
                          $scope.user.password,
                          CryptoJS.enc.Hex.parse(response.data.salt1),
                          CryptoJS.enc.Hex.parse(response.data.salt2)
                        );
            CurrentSession.register(new ApiAuth($scope.user.email, token)).then(function() {
              CurrentSession.save();
              $location.path('/home');
            }, function() {
              $scope.serverBusy = true;
            });
          }, function(response) {
            if (response.error instanceof ApiErrors.Api) {
              angular.forEach(response.error.getErrors(), function(errorText) {
                if (errorText === 'api.already_taken.Email') {
                  $scope.registerForm.email.$setValidity('unique', false);
                }
              }.bind(this));
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
            //Possibly implement your own here.
          }, true);
        });
      }
    };
  });
