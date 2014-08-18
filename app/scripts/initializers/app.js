/*global $*/

'use strict';

angular
  .module('squareteam.app')
  .run(function(moment) {
    ///////////////
    // Moment.js //
    ///////////////

    moment.lang('en', {
      calendar : {
        lastDay : '[yesterday at] LT',
        sameDay : '[today at] LT',
        nextDay : '[tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L'
      }
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $analyticsProvider, ngDialogProvider) {

    //////////////
    // ngDialog //
    //////////////

    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-squareteam',
      showClose: true,
      closeByDocument: true,
      closeByEscape: true
    });

    /////////////////
    // Angulartics //
    /////////////////

    // Disable Angulartics in dev mode
    $analyticsProvider.virtualPageviews(window.location.hostname.match(/dev\.squareteam/) === null);

    ///////////////
    // Translate //
    ///////////////

    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');

    /////////////////////
    // Routing Helpers //
    /////////////////////

    var routingHelpers = {
      checkAuthenticated : function(CurrentSession, $q, $log) {

        var deferred = $q.defer();

        if (!CurrentSession.isAuthenticated()) {
          CurrentSession.restore().then(function() {
            if (CurrentSession.isAuthenticated()) {
              deferred.resolve();
            } else {
              $log.info('redirect to login');
              deferred.reject({
                redirectToState : 'public.login'
              });
            }
          }.bind(this));
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      },

      checkAnonymous : function(CurrentSession, $q) {

        var deferred = $q.defer();

        if (CurrentSession.isAuthenticated()) {
          deferred.reject({
            redirectToState : 'app.home'
          });
        } else {
          CurrentSession.restore().then(function() {
            if (!CurrentSession.isAuthenticated()) {
              deferred.resolve();
            } else {
              deferred.reject({
                redirectToState : 'app.home'
              });
            }
          }.bind(this));
        }

        return deferred.promise;
      },

      currentOrganization : function(authenticated, CurrentSession, $q, $stateParams) {

        var deferred = $q.defer();

        CurrentSession.getOrganizations().then(function(organizations) {

          var organization = $.grep(organizations, function(organization) {
            return organization.id === parseInt($stateParams.organizationId, 10);
          });
          if (organization.length === 1) {
            deferred.resolve(organization[0]);
          } else {
            deferred.reject(
              new Error(['Organization #', $stateParams.organizationId, ' not found'].join(''))
            );
          }
        });

        return deferred.promise;
      }
    };

    routingHelpers.checkAuthenticated.$inject   = ['CurrentSession', '$q', '$log'];
    routingHelpers.checkAnonymous.$inject       = ['CurrentSession', '$q'];
    routingHelpers.currentOrganization.$inject  = ['authenticated', 'CurrentSession', '$q', '$stateParams'];

    ///////////////////
    // Define states //
    ///////////////////

    // Public routes
    $stateProvider

      .state('public', {
        abstract : true,
        resolve : {
          anonymous : routingHelpers.checkAnonymous
        },
        templateUrl: 'views/public/layout.html'
      })

      .state('public.login', {
        url : '/login',
        controller : 'LoginCtrl',
        templateUrl : 'views/public/login.html'
      })
      
      .state('public.register', {
        url : '/register',
        templateUrl : 'views/public/register.html'
      })

      .state('public.forgotPassword', {
        abstract : true,
        template : '<ui-view></ui-view>'
      })

      .state('public.forgotPassword.request', {
        url : '/forgot_password/request',
        controller : 'forgotPasswordCtrl',
        templateUrl : 'views/public/forgotPassword/request.html'
      })

      .state('public.forgotPassword.request_sent', {
        url : '/forgot_password/request_sent',
        templateUrl : 'views/public/forgotPassword/request_sent.html'
      })

      .state('public.forgotPassword.change', {
        url : '/forgot_password/change/:token',
        controller : 'forgotPasswordCtrl',
        templateUrl : 'views/public/forgotPassword/change.html'
      })

      .state('public.forgotPassword.changed', {
        url : '/forgot_password/change_success',
        templateUrl : 'views/public/forgotPassword/change_success.html'
      });

    $stateProvider
      // App namespace
      //  Used for authenticated zone restriction
      .state('app', {
        abstract : true,
        resolve : {
          authenticated : routingHelpers.checkAuthenticated
        },
        templateUrl: 'views/app/layout.html'
      })

      // Home page for authenticated users
      .state('app.home', {
        url : '/home',
        templateUrl: 'views/app/home.html',
        controller: 'HomeCtrl'
      })


      // Account Management

      .state('app.account', {
        url : '/account',
        controller : 'MyAccountCtrl',
        templateUrl: 'views/app/account.html',
      })


      // KNOWLEDGE CENTER

      .state('app.knowledge', {
        url : '/knowledge',
        templateUrl : 'views/app/knowledge/index.html'
      })

      .state('app.knowledge.create', {
        url : '/knowledge/add'
      })

      .state('app.knowledge.edit', {
        url : '/knowledge/edit/:item_id'
      })

      .state('app.knowledge.by_project', {
        url : '/knowledge/filter/:projectId/:missionId/:tags'
      })

      // PROJECTS

      .state('app.projects', {
        url : '/projects',
        templateUrl : 'views/app/projects/index.html',
        resolve : {
          organizations : ['authenticated', 'CurrentSession', function(authenticated, CurrentSession) {
            return CurrentSession.getOrganizations();
          }]
        },
        controller : ['$scope', 'CurrentSession', 'organizations', function($scope, CurrentSession, organizations) {
          $scope.organization = organizations[0];
        }]
      })

      .state('app.projects.create', {
        url : '/projects/add'
      })

      .state('app.projects.edit', {
        url : '/projects/edit/:projectId'
      })

      // MISSIONS

      .state('app.missions', {
        url : '/projects/:projectId/missions'
      })

      .state('app.my_missions', {
        url : '/missions/mine'
      })

      .state('app.missions.add', {
        url : '/add'
      })

      .state('app.missions.view', {
        url : '/:missionId'
      })

      .state('app.missions.edit', {
        url : '/:missionId/edit'
      })

      // TASKS

      .state('app.tasks', {
        url : '/missions/:missionId/tasks'//,
        // templateUrl : 'views/app/missions/index.html'
      })

      .state('app.tasks.add', {
        url : '/add'
      })

      .state('app.tasks.view', {
        url : '/:taskId'
      })

      .state('app.tasks.edit', {
        url : '/:taskId/edit'
      })

      // ADMIN

      .state('app.organization_create', {
        url : '/organization/create',
        templateUrl : 'views/register_organization.html'
      })

      .state('app.organizations', {
        url : '/organizations',
        templateUrl : 'views/app/manage/organizations.html',
        controller : 'Organizations'
      })

      .state('app.organization', {
        url : '/organization/:organizationId',
        abstract : true,
        template : '<ui-view></ui-view>',
        resolve : {
          currentOrganization : routingHelpers.currentOrganization
        }
      })

      .state('app.organization.manage', {
        url : '/manage',
        templateUrl : 'views/app/manage/organization/index.html',
        controller : 'ManageOrganizationCtrl'
      })

      .state('app.organization.team', {
        url : '/team/:teamId',
        templateUrl : 'views/app/manage/team.html',
        controller : ['$scope', '$stateParams', function($scope, $stateParams) {
          $scope.teamId = $stateParams.teamId;
        }]
      });

    $urlRouterProvider
      .otherwise('/register');

  });