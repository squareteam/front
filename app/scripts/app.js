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
    'ui.router'
  ])
  .config(function ($stateProvider/*, $urlRouterProvider*/) {
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data : {
          acl : {
            'public' : true
          }
        }
      })
      .state('register', {
        url : '/register',
        templateUrl: 'views/register.html',
        data : {
          acl : {
            'public' : true
          }
        }
      })
      .state('home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });

    // $urlRouterProvider
    //   .otherwise({
    //     redirectTo: '/home'
    //   });

  });