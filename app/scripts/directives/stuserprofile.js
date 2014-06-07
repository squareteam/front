'use strict';

/*global $*/

// [WIP]
// User profile view
// Allow to display read-only or editable user profile
// 
// - userId: should be an integer (default: 0)
// - editable: allow to edit profile (default: false)

angular.module('squareteam.app')
  .directive('stUserProfile', function () {
    return {
      templateUrl: 'scripts/directives/templates/stuserprofile.html',
      restrict: 'E',
      scope : {
        userId    : '=',
        editable  : '@'
      },
      replace : true,
      compile : function(tElement, tAttrs) {
        if (typeof tAttrs.editable === 'undefined') {
          tElement.find('input').each(function(index, input) {
            var $input  = $(input),
                ngModel = $input.attr('ng-model');
            $input.replaceWith('<span>{{ ' + ngModel + ' }}</span>');
          });
        }
      },
      controller: function($scope, $element, $attrs, $location, UserRessource, CurrentSession, lodash) {
        
        var user, updateUser;

        updateUser = lodash.throttle(function(user) {
          if (user) {
            UserRessource.update({
              id : user.id
            }, {
              email : user.email,
              name  : user.name
            }, function() {
              // Force CurrentSession to reload user data
              CurrentSession.reloadUser();
            });
          }
        }, 1000, {
          'leading': false
        });

        user = UserRessource.get({
          id : $scope.userId
        }, function() {
          $scope.user = user;

          $scope.$watchCollection('user', updateUser);
        }.bind(this), function() {
          console.error('Failed to load user#' + $scope.userId);
        });

        UserRessource.organizations.query({
          userId : $scope.userId
        }, function(organizations) {
          $scope.organizations = organizations;

        }.bind(this), function() {
          console.error('Failed to load organizations for user#' + $scope.userId);
        });
      }
    };
  });
