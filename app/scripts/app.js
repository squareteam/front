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

// TODO : split this files into many

angular
  .module('squareteam.app', [
    'squareteam.api',
    'squareteam.ressources',
    'ngSanitize',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    var routingHelpers = {
      checkAuthenticated : function(Currentuser, ApiSession, UserRessource, $q) {

          function isUserAuthenticated() {
            console.log('isUserAuthenticated?', ApiSession.isAuthenticated());
            if (ApiSession.isAuthenticated()) {
              deferred.resolve();
            } else {
              console.log('redirect to login');
              deferred.reject({
                redirectToState : 'login'
              });
            }
          }

          var deferred = $q.defer();

          console.log('ApiSession.$pristine?', ApiSession.$pristine);

          if (ApiSession.$pristine) {
            ApiSession.restore().then(function() {
              isUserAuthenticated();
            }.bind(this));
          } else {
            isUserAuthenticated();
          }

          return deferred.promise;
        }
    };

    routingHelpers.checkAuthenticated.$inject = ['Currentuser', 'ApiSession', 'UserRessource', '$q'];


    ///////////////////
    // Define states //
    ///////////////////


    // Public routes
    $stateProvider
      .state('login', {
        url : '/login',
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
          configure : ['$injector','$q', 'Currentuser', 'UserRessource', function($injector, $q, Currentuser, UserRessource) {
            
            function checkUserConfiguration () {
              var organizations = UserRessource.organizations.query({
                  userId : Currentuser.getUser().id
                },
                {}, // data
                function() {
                  if (organizations.length) {
                    Currentuser.setOrganizations(organizations);
                    deferred.resolve();
                  } else {
                    console.log('redirect to organization creation');
                    // $state.go('register_organization');
                    deferred.reject({
                      redirectToState : 'register_organization'
                    });
                  }
                }
              );
            }

            var deferred = $q.defer();

            $injector.invoke(routingHelpers.checkAuthenticated).then(function() {
              checkUserConfiguration();
            }, deferred.reject);

            return deferred.promise;
          }]
        },
        templateUrl: 'views/app/layout.html',
        controller : ['$scope', function($scope) {
          $scope.currentOrganization = $scope.currentUser.getCurrentOrganization().id;
        }]
      })

      // register a new organization
      .state('register_organization', {
        url : '/register/organization',
        resolve : {
          authenticated : routingHelpers.checkAuthenticated
        },
        templateUrl : 'views/register_organization.html'
      })

      // Home page for authenticated users
      .state('app.home', {
        url : '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })

      // Admin namespace
      .state('app.admin', {
        url : '/manage/:id',
        controller : ['$scope', '$stateParams', function($scope, $stateParams) {
          $scope.organization = $.grep($scope.currentUser.getOrganizations(), function(organization) {
            return organization.id === parseInt($stateParams.id, 10);
          })[0];
        }],
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

// DO NOT EDIT LINE BELOW
//  open README.md for more explaination
var version = '0.0.7';
angular.module('squareteam.app').value('VERSION', version);
