'use strict';

angular.module('squareteam.app')
  .directive('stOauthLink', function () {
    return {
      scope: {
        service : '@',
        mode : '@'
      },
      templateUrl: 'scripts/directives/templates/stoauthlink.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs, $log, $translate, appConfig) {
        if (!appConfig.api.oauth[$scope.service]) {
          $log.error('no configuration for oauth service : ' + $scope.service);
          return;
        }

        var config = appConfig.api.oauth[$scope.service];

        $scope.serviceIconPath = config.iconPath;
        $scope.serviceEndpoint = config.endpoint;
        $scope.serviceName     = config.name;

        $translate($scope.mode === 'signin' ? 'directives.stOAuthLink.signIn' : 'directives.stOAuthLink.signUp').then(function (translation) {
          $scope.actionName = translation;
        });
      }
    };
  });
