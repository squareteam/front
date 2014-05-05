'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, $location, Currentuser, ApiSession, OrganizationRessource) {
    $scope.name = Currentuser.getUser().name;

    var organizations = OrganizationRessource.query(function() {
      $scope.organizations = organizations;
    }.bind(this));

    $scope.logout = function() {
      ApiSession.logout().then(function() {
        $location.path('/login');
      }.bind(this), function() {
        $location.path('/home'); // FIXME ?
      }.bind(this));
    };
  });
