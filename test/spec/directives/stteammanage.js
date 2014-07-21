/* global $, provideAuth */

'use strict';

describe('Directive: st-team-manage', function () {

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stusersearch.html'));
  beforeEach(module('scripts/directives/templates/stteammanage.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }));

  var appConfig,
      $httpBackend, $rootScope, $state, $compile,
      element, scope;

  beforeEach(inject(function ($injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $state          = $injector.get('$state');
    $compile        = $injector.get('$compile');

    appConfig       = $injector.get('appConfig');

    // provide a valid auth for the test
    provideAuth($injector)();

    scope = $rootScope.$new();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('when giving a non-existent team', function() {
    var alertLoadTeamError, alertRemoveUsers, alertAddUser, alertUpdateUser;

    it('should show a error message', function() {
      element = angular.element('<st-team-manage team-id="1323"></st-team-manage>');

      $httpBackend.expectGET(appConfig.api.url + 'teams/1323').respond(404, '{"errors":["api.not_found"],"data":null}');
      
      element = $compile(element)(scope);

      $rootScope.$digest();

      alertLoadTeamError  = $(element.find('.alert')[0]);
      alertRemoveUsers    = $(element.find('.alert')[1]);
      alertAddUser        = $(element.find('.alert')[2]);
      alertUpdateUser     = $(element.find('.alert')[3]);

      $httpBackend.flush();

      $rootScope.$digest();

      expect(alertLoadTeamError.hasClass('ng-hide')).toBe(false);
      expect(alertRemoveUsers.hasClass('ng-hide')).toBe(true);
      expect(alertAddUser.hasClass('ng-hide')).toBe(true);
      expect(alertUpdateUser.hasClass('ng-hide')).toBe(true);
    });

  });



  describe('when giving a existent team', function() {
    var alertLoadTeamError, alertRemoveUsers, alertAddUser, alertUpdateUser;

    // CHECK API

    describe('should expose to scope', function() {
      beforeEach(inject(function($compile) {
        element = angular.element('<st-team-manage team-id="1"></st-team-manage>');

        $httpBackend.expectGET(appConfig.api.url + 'teams/1').respond(200, '{"errors":null,"data":{"name":"test","users":[{"name":"Charly","id":1}]}}');

        element = $compile(element)(scope);
        $rootScope.$digest();

        $httpBackend.flush();
      }));

      it('`addUserToTeam` method', function() {
        expect(!!element.isolateScope().addUserToTeam).toBe(true);
      });

      it('`removeUsers` method', function() {
        expect(!!element.isolateScope().removeUsers).toBe(true);
      });

      it('`toggleUserRemoveFromTeam` method', function() {
        expect(!!element.isolateScope().toggleUserRemoveFromTeam).toBe(true);
      });
    });

    // CHECK LISTING

    describe('when user list loaded', function() {

      beforeEach(function() {
        $httpBackend.expectGET(appConfig.api.url + 'teams/1').respond(200, '{"errors":null,"data":{"name":"test","id":1,"users":[{"name":"Charly","id":1}]}}');

        element = angular.element('<st-team-manage team-id="1"></st-team-manage>');
        element = $compile(element)(scope);

        $rootScope.$digest();

        alertLoadTeamError  = $(element.find('.alert')[0]);
        alertRemoveUsers    = $(element.find('.alert')[1]);
        alertAddUser        = $(element.find('.alert')[2]);
        alertUpdateUser     = $(element.find('.alert')[3]);
      });

      it('should not display error and list users', function() {

        $httpBackend.flush();

        $rootScope.$digest();

        expect($(element).find('.users_list li').length).toBe(1);
        // TODO(charly): mock "st-user-card" directive while testing
      });

      describe('when adding user with addUserToTeam()', function() {

        beforeEach(function() {
          // flush load team request
          $httpBackend.flush();
          $rootScope.$digest();
        });

        it('should add user to list if success', function() {

          $httpBackend.expectPOST(appConfig.api.url + 'teams/1/users').respond(200, '{"errors":null,"data":[]}');

          element.isolateScope().addUserToTeam({
            name : 'Paul',
            id   : 2
          });

          $httpBackend.flush();

          $rootScope.$digest();

          expect($(element).find('.users_list li').length).toBe(2);
        });

        it('should display error if failure', function() {

          $httpBackend.expectPOST(appConfig.api.url + 'teams/1/users').respond(401, '{"errors":["api.unauthorized"],"data":[]}');

          element.isolateScope().addUserToTeam({
            name : 'Paul',
            id   : 2
          });

          $httpBackend.flush();

          $rootScope.$digest();

          expect($(element).find('.users_list li').length).toBe(1);
          expect(alertAddUser.hasClass('ng-hide')).toBe(false);
        });


      });

      describe('when removing user with removeUsers()', function() {

        beforeEach(function() {
          // flush load team request
          $httpBackend.flush();
          $rootScope.$digest();
        });

        it('should remove user from list if success', function() {

          $httpBackend.expectDELETE(appConfig.api.url + 'teams/1/users/1').respond(200, '{"errors":null,"data":[]}');

          element.isolateScope().toggleUserRemoveFromTeam({ id : 1 });

          element.isolateScope().removeUsers();

          $httpBackend.flush();

          $rootScope.$digest();

          expect($(element).find('.users_list li').length).toBe(0);
        });

        it('should display error if failure', function() {

          $httpBackend.expectDELETE(appConfig.api.url + 'teams/1/users/1').respond(401, '{"errors":["api.unauthorized"],"data":[]}');

          element.isolateScope().toggleUserRemoveFromTeam({ id : 1 });

          element.isolateScope().removeUsers();

          $httpBackend.flush();

          $rootScope.$digest();

          expect($(element).find('.users_list li').length).toBe(1);
          expect(alertRemoveUsers.hasClass('ng-hide')).toBe(false);
        });


      });

      describe('when updating user permissions', function() {

        beforeEach(function() {
          // flush load team request
          $httpBackend.flush();
          $rootScope.$digest();

          var directiveScope = element.isolateScope();
          directiveScope = angular.extend(directiveScope, {
            editUserRole : {
              id    : 1,
              name  : 'charly'
            }
          });
          element.data('$isolateScope', directiveScope);

          $rootScope.$digest();
        });

        it('should close permissions editor if success', function() {

          $httpBackend.expectPUT(appConfig.api.url + 'teams/1/users/1').respond(200, '{"errors":null,"data":[]}');

          element.isolateScope().updateUserRole();

          $httpBackend.flush();

          $rootScope.$digest();

          expect($($(element).find('.permissions_manager')[0]).hasClass('ng-hide')).toBe(true);
        });

        it('should display error if failure', function() {

          $httpBackend.expectPUT(appConfig.api.url + 'teams/1/users/1').respond(401, '{"errors":["api.unauthorized"],"data":[]}');

          element.isolateScope().updateUserRole();

          $httpBackend.flush();

          $rootScope.$digest();

          expect(alertUpdateUser.hasClass('ng-hide')).toBe(false);
        });

      });

    });

  });
});
