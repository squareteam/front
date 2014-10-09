/* global apiURL, provideAuth, apiResponseAsString */

'use strict';

describe('Controller: ManageOrganizationCtrl', function () {

  beforeEach(module('views/app/manage/organization/popins/team.html'));

  beforeEach(module('squareteam.app', function($provide) {
    $provide.service('$state', function() {
      this.go = function() {};
    });
  }));

  var ManageOrganizationCtrl, ApiSession, url,
      $state, $q, $rootScope, $httpBackend,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $injector) {

    $state        =  $injector.get('$state');
    $rootScope    =  $injector.get('$rootScope');
    $q            =  $injector.get('$q');
    $httpBackend  =  $injector.get('$httpBackend');

    ApiSession  =  $injector.get('ApiSession');

    url = apiURL($injector);

    provideAuth($injector)();

    $httpBackend.expectGET( url('organizations/1') ).respond(200, apiResponseAsString(null, {'id':1,'name':'FMB','description':'test test'}));
    $httpBackend.expectGET( url('organizations/1/teams') ).respond(200, apiResponseAsString(null, [{'id':6,'name':'Admin','users':[{'id':1,'name':'Charly P.','email':'charly@squareteam.io','provider':'squareteam','permissions':0}]}]));

    scope = $rootScope.$new();
    ManageOrganizationCtrl = $controller('ManageOrganizationCtrl', {
      $scope              : scope,
      currentOrganization : {
        id : 1
      }
    });

    scope.$digest();

    $httpBackend.flush();

  }));

  describe('at initial state', function() {

    it('should expose current organization', function() {

      scope.$digest();

      expect(scope.organization.id).toEqual(1);
      expect(scope.organization.name).toEqual('FMB');

    });

    it('should expose current organization teams', function() {

      scope.$digest();

      expect(scope.teams.length).toBe(1);
      expect(scope.teams[0].name).toBe('Admin');

    });

  });

  describe('team selection', function() {

    beforeEach(function() {

      scope.manageTeam(scope.teams[0]);

      scope.$digest();

    });


    describe('when editing user permissions', function() {

      beforeEach(function() {

        scope.editingUsers.push(scope.teams[0].users[0].id);

        scope.$digest();

      });

      it('user should be flagged as being edited', function() {

        expect(scope.isEditing(scope.teams[0].users[0])).toBe(true);

      });

      describe('when saving changes', function() {

        beforeEach(function() {

          $httpBackend.expectPUT( url('teams/6/users/1') ).respond(200, apiResponseAsString(null, '{}'));

        });

        it('should make API request and remove "flag"', function() {

          scope.updateUser(scope.teams[0].users[0]);

          $httpBackend.flush();

          scope.$digest();

          expect(scope.isEditing(scope.teams[0].users[0])).toBe(false);

        });

      });


    });

    describe('when removing user', function() {

      beforeEach(function() {

        $httpBackend.expectDELETE( url('teams/6/users/1') ).respond(200, apiResponseAsString(null, '{}'));

      });

      it('should make API request and remove user from list', function() {

        scope.removeUser(scope.teams[0].users[0]);

        $httpBackend.flush();

        scope.$digest();

        expect(scope.teams[0].users.length).toBe(0);

      });

    });

  });

  describe('when updating/creating team', function() {

    var popinScope;

    beforeEach(function() {

      scope.openPopin('create');

      scope.$digest();

      popinScope = scope.$$childHead;

    });

    describe('when saving', function() {

      beforeEach(function() {

        $httpBackend.expectPOST( url('organizations/1/teams') ).respond(201, apiResponseAsString(null, { id : 1, name : 'test', users : []}));

        popinScope.name   = 'test';
        popinScope.color  = '#CCC';

      });

      describe('with users added', function() {

        beforeEach(function() {
          $httpBackend.expectPOST( url('teams/1/users') ).respond(201, apiResponseAsString(null, {}));
          popinScope.teamUsersDiff = {
            added : [
              {
                id : 1,
                name : 'charly'
              }
            ]
          };
        });

        it('should add user to created team', function() {

          popinScope.save();

          $httpBackend.flush();

          expect(popinScope.team.users.length).toBe(1);
        });

      });


      xdescribe('with users removed', function() {

        beforeEach(function() {
          $httpBackend.expectDELETE( url('teams/1/users/2') ).respond(201, apiResponseAsString(null, {}));
          popinScope.teamUsersDiff = {
            deleted : [
              {
                id : 2,
                name : 'paul'
              }
            ]
          };
        });

        it('should remove user', function() {

          popinScope.save();

          $httpBackend.flush();

        });

      });


    });

  });


});