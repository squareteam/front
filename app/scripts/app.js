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
      .when('/register', {
        templateUrl: 'views/register.html',
        // controller: 'RegisterCtrl',
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