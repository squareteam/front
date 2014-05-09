/* global $ */
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

    $stateProvider.decorator('resolve', function(state) {
      var resolve         = state.resolve,
          isAuthenticated = false,
          ptr             = state;

      // try to find the closest parent /w auth needed
      while (!!ptr && !isAuthenticated) {
        isAuthenticated = !!ptr.authenticated;
        ptr = ptr.parent;
      }

      if (isAuthenticated && !state.abstract) {
        if (!!resolve) {
          resolve = {};
        }

        resolve.authenticated = ApiSessionRoutingHelpersProvider.checkAuthenticated;
      }

      return resolve;
    });

    ///////////////////
    // Define states //
    ///////////////////

    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl: 'views/login.html'
      })
      .state('register', {
        url : '/register',
        templateUrl: 'views/register.html'
      })
      .state('register_organization', {
        url : '/register/organization',
        templateUrl : 'views/register_organization.html'
      });

    $stateProvider
      .state('app', {
        abstract : true,
        templateUrl: 'views/app/layout.html',
        authenticated : true,
        controller : function($scope) {
          $scope.currentOrganization = $scope.currentUser.getCurrentOrganization().id;
        }
      })
      .state('app.home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });

    $stateProvider
      .state('app.admin', {
        url : '/manage/:id',
        controller : function($scope, $stateParams) {
          $scope.organization = $.grep($scope.currentUser.getOrganizations(), function(organization) {
            return organization.id === parseInt($stateParams.id, 10);
          })[0];
        },
        templateUrl: 'views/app/admin/index.html'
      })
      .state('app.admin.teams', {
        url : '/teams',
        templateUrl: 'views/app/admin/teams.html'
      })
      .state('app.admin.members', {
        url : '/members',
        templateUrl: 'views/app/admin/members.html'
      });

    $urlRouterProvider
      .otherwise('/home');

  });
/*ignore jslint start*/
var version = "0.0.4";
window.VERSION = version;
/*ignore jslint end*/