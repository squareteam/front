'use strict';

angular.module('squareteam.app')
  .controller('HomeCtrl', function ($scope, $location, Currentuser, ApiSession, UserRessource) {

    var organizations = UserRessource.organizations.query({
      userId : $scope.currentUser.getUser().id
    }, function() {
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
