'use strict';

angular.module('squareteam.app').
  controller('Organizations', function($scope, CurrentSession) {
    CurrentSession.getOrganizations().then(function(organizations) {
      $scope.organizations = organizations;
    });
  });