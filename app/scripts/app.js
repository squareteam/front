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
  .config(function ($stateProvider, $urlRouterProvider, ApiSessionRoutingHelpersProvider) {

    ///////////////////////////////////////////
    // Define custom state decorator for ACL //
    ///////////////////////////////////////////

    $stateProvider.decorator('authenticated', function(state) {
      var isAuthenticated = false,
          ptr = state;

      // try to find the closest parent /w auth needed
      while (!!ptr && !isAuthenticated) {
        isAuthenticated = !!ptr.authenticated;
        ptr = ptr.parent;
      }

      if (isAuthenticated && !state.abstract) {
        if (!!state.resolve) {
          state.resolve = {};
        }

        state.resolve.authenticated = ApiSessionRoutingHelpersProvider.checkAuthenticated;
      }

      return state.authenticated;
    });

    ///////////////////
    // Define states //
    ///////////////////

    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url : '/register',
        templateUrl: 'views/register.html'
      });

    $stateProvider
      .state('app', {
        abstract : true,
        template: '<ui-view/>',
        authenticated : true
      })
      .state('app.home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });

    $urlRouterProvider
      .otherwise('/home');

  });