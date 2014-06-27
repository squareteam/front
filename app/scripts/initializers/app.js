/*global $*/

'use strict';

angular
  .module('squareteam.app')
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {


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
      }
    };

    routingHelpers.checkAuthenticated.$inject = ['CurrentSession', '$q', '$log'];


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
        url : '/forgotPassword/request',
        controller : 'forgotPasswordCtrl',
        templateUrl : 'views/public/forgotPassword/request.html'
      })

      .state('public.forgotPassword.request_sent', {
        url : '/forgotPassword/request_sent',
        templateUrl : 'views/public/forgotPassword/request_sent.html'
      })

      .state('public.forgotPassword.change', {
        url : '/forgotPassword/change/:token',
        controller : 'forgotPasswordCtrl',
        templateUrl : 'views/public/forgotPassword/change.html'
      })

      .state('public.forgotPassword.changed', {
        url : '/forgotPassword/change_success',
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
        url : '/knowledge/filter/project/:project_id'
      })

      .state('app.knowledge.by_mission', {
        url : '/knowledge/filter/mission/:mission_id'
      })

      .state('app.knowledge.by_tags', {
        url : '/knowledge/filter/tags/:tags'
      })

      // PROJECTS

      .state('app.projects', {
        url : '/projects',
        templateUrl : 'views/app/projects/index.html'
      })

      .state('app.projects.create', {
        url : '/projects/add'
      })

      .state('app.projects.edit', {
        url : '/projects/edit/:project_id'
      })

      // MISSIONS

      .state('app.missions', {
        url : '/projects/:project_id/missions'
      })

      .state('app.my_missions', {
        url : '/missions/mine'
      })

      .state('app.missions.add', {
        url : '/add'
      })

      .state('app.missions.view', {
        url : '/:mission_id'
      })

      .state('app.missions.edit', {
        url : '/:mission_id/edit'
      })

      // TASKS

      .state('app.tasks', {
        url : '/missions/:mission_id/tasks',
        templateUrl : 'views/app/missions/index.html'
      })

      .state('app.tasks.add', {
        url : '/add'
      })

      .state('app.tasks.view', {
        url : '/:task_id'
      })

      .state('app.tasks.edit', {
        url : '/:task_id/edit'
      })

      // ADMIN

      .state('app.organization_create', {
        url : '/organization/create',
        templateUrl : 'views/register_organization.html'
      })

      .state('app.organizations', {
        url : '/organizations',
        templateUrl : 'views/app/manage/organizations.html',
        controller : ['$scope', 'CurrentSession', function($scope, CurrentSession) {
          CurrentSession.getOrganizations().then(function(organizations) {
            $scope.organizations = organizations;
          }, function() {
            console.error('Unable to load organizations for user #' + CurrentSession.getUser().id);
          });
        }]
      })

      .state('app.organization', {
        url : '/organization/:organizationId',
        templateUrl : 'views/app/manage/organization/index.html',
        controller : ['$scope', '$stateParams', 'CurrentSession', function($scope, $stateParams, CurrentSession) {
          
          CurrentSession.getOrganizations().then(function(organizations) {

            var organization = $.grep(organizations, function(organization) {
              return organization.id === parseInt($stateParams.organizationId, 10);
            });
            if (organization.length === 1) {
              $scope.organization = organization[0];
            } else {
              console.error('404 organization #' + $stateParams.organizationId);
              // error
            }

          }, function() {
            console.error('Unable to load organizations for user #' + CurrentSession.getUser().id);
          });
        }]
      })

      .state('app.organization.teams', {
        url : '/teams'
      })

      .state('app.organization.teams.members', {
        url : '/:team_id/members'
      });


    $urlRouterProvider
      .otherwise('/register');

  });