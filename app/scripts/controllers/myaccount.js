/* global alert */

'use strict';

angular.module('squareteam.app')

  .controller('MyAccountCtrl', function ($scope, $http, $location, ApiSession, CurrentSession, UserResource, PasswordConfirmPopin, appConfig, ApiErrors, ApiSessionStorageCookies, stUtils, stPolicies) {

    // INITIALIZE
    $scope.isOAuthAccount = CurrentSession.isOAuthAccount();
    $scope.user           = CurrentSession.getUser();


    function $$refreshSession (password) {
      ApiSession.login($scope.user.email, password).catch(function() {
        alert('Refresh session failed !');
        $scope.user.$restore();
      });
    }

    function redirectOAuthRefreshSession () {
      var endpoint = appConfig.api.oauth[$scope.user.provider] && appConfig.api.oauth[$scope.user.provider].endpoint;
      if (angular.isString(endpoint)) {
        alert('profile updated, redirection...');
        stUtils.redirect(endpoint, 300);
      } else {
        alert('oauth redirection failed, logout..');
        CurrentSession.unregister(); // to prevent XHR on /logout (that will fail)
        ApiSessionStorageCookies.destroy();
        $location.path('/login');
      }
    }

    // EXPOSE METHODS

    $scope.passwordFormat = function() {
      $scope.passwordBadPractice = !stPolicies.isPasswordValid($scope.user.password);
    };

    $scope.updateUser = function() {
      var emailOrPasswordWasDirty = $scope.user.$dirty('password') || $scope.user.$dirty('email');

      $scope.user.$save().$then(function() {

        // Force CurrentSession to reload user data
        if (emailOrPasswordWasDirty) {

          if ($scope.isOAuthAccount) {
            redirectOAuthRefreshSession();
          } else {
            // need to re-register session, so prompt password
            PasswordConfirmPopin.prompt().then(function(confirmPassword) {

              if ($scope.user.$dirty('password')) {

                $http.put('apis://users/me/change_password', {
                  password  : $scope.user.password
                }).then(function() {
                  CurrentSession.unregister(); // to prevent XHR on /logout (that will fail)
                  $$refreshSession($scope.user.password);
                }, function() {
                  alert('Update canceled !');
                  $scope.user.$restore();
                });
              } else {
                $$refreshSession(confirmPassword);
              }
            }, function() {
              alert('Update canceled !');
              $scope.user.$restore();
            });
          }
        } else {
          CurrentSession.reloadUser();
        }
      }, function(response) {
        if (response.error instanceof ApiErrors.Api) {
          angular.forEach(response.error.getErrors(), function(errorText) {
            if (errorText === 'api.already_taken.Email') {
              $scope.userForm.email.$setValidity('unique', false);
            }
          }, this);
        } else {
          $scope.user.$restore();
        }
      });
    };

  });
