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
                  redirectToState : 'login'
                });
              }
            }.bind(this));
          } else {
            deferred.resolve();
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
      .state('login', {
        url : '/login',
        controller : 'LoginCtrl',
        templateUrl: 'views/login.html'
      })
      .state('register', {
        url : '/register',
        templateUrl: 'views/register.html'
      });

    $stateProvider
      // App namespace
      //  Used for authenticated zone restriction
      .state('app', {
        abstract : true,
        resolve : {
          authenticated : routingHelpers.checkAuthenticated
        },
        // resolve : {
        //   configure : ['$injector','$q', 'Currentuser', 'UserRessource', function($injector, $q, Currentuser, UserRessource) {
            
        //     function checkUserConfiguration () {
        //       var organizations = UserRessource.organizations.query({
        //           userId : Currentuser.getUser().id
        //         },
        //         {}, // data
        //         function() {
        //           if (organizations.length) {
        //             Currentuser.setOrganizations(organizations);
        //             deferred.resolve();
        //           } else {
        //             deferred.reject({
        //               redirectToState : 'register_organization'
        //             });
        //           }
        //         }
        //       );
        //     }

        //     var deferred = $q.defer();

        //     $injector.invoke(routingHelpers.checkAuthenticated).then(function() {
        //       checkUserConfiguration();
        //     }, deferred.reject);

        //     return deferred.promise;
        //   }]
        // },
        templateUrl: 'views/app/layout.html'//,
        // controller : ['$scope', function($scope) {
        //   $scope.currentOrganization = $scope.currentUser.getCurrentOrganization().id;
        // }]
      })

      .state('app.organization', {
        abstract: true,
        template : '<ui-view></ui-view>'
      })

      // register a new organization
      .state('app.organization.create', {
        url : '/organization/create',
        templateUrl : 'views/register_organization.html'
      })

      // Home page for authenticated users
      .state('app.home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })


      // Account Management

      .state('app.account', {
        url : '/account',
        templateUrl: 'views/app/account.html',
      })

      // Admin namespace
      
      .state('app.admin', {
        url : '/manage/:id',
        abstract : true,
        template : '<ui-view></ui-view>',
        controller : ['$scope', '$stateParams', function($scope, $stateParams) {
          $scope.organization = $.grep($scope.currentSession.getOrganizations(), function(organization) {
            return organization.id === parseInt($stateParams.id, 10);
          })[0];
        }]
      })

      .state('app.admin.general', {
        url : '/general',
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