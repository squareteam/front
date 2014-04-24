'use strict';

angular.module('squareteam.app')
  .controller('MainCtrl', function ($scope, User) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    User.get({id : 1});
  });
