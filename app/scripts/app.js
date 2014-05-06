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
  .config(function ($stateProvider, $urlRouterProvider) {

    var sessionCheck = ['ApiSession', '$q', '$location', function(ApiSession, $q, $location) {
      var defer = $q.defer();

      function isUserAuthenticated() {
        if (ApiSession.isAuthenticated()) {
          defer.resolve();
        } else {
          defer.reject();
          $location.path('/login');
        }
      }

      if (ApiSession.$pristine) {
        ApiSession.restore().then(function() {
          isUserAuthenticated();
        }.bind(this));
      } else {
        isUserAuthenticated();
      }

      return $q.promise;
    }];

    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url : '/register',
        templateUrl: 'views/register.html'
      })
      .state('home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        resolve : {
          access : sessionCheck
        }
      });

    $urlRouterProvider
      .otherwise('/home');

  });