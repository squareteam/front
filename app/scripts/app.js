'use strict';

angular.module('squareteam.ressources', [
  'ngCookies',
  'ngResource'
]);

angular.module('squareteam.api', [])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('ApiHttpInterceptors');
  });

angular
  .module('squareteam.app', [
    'squareteam.api',
    'squareteam.ressources',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        anonymous: true
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        anonymous: false
      })
      .otherwise({
        redirectTo: '/home'
      });

  });

// TODO : not include config in git repo..
angular.module('squareteam.app').value('appConfig', {
  api : {
    url       : 'http://localhost:1551/api/',
    storageNS : 'ST_SESSION'
  }
});