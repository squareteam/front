/* global apiURL, provideAuth */

'use strict';

describe('Controller: ManageOrganizationCtrl', function () {

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

    $httpBackend.expectGET( url('organizations/1') ).respond(200, '{"data":{"id":1,"name":"FMB","description":"test test"}}');
    $httpBackend.expectGET( url('organizations/1/teams') ).respond(200, '{"data":[{"id":6,"name":"Admin","users":[{"id":1,"name":"Charly P.","email":"charly@squareteam.io","provider":"squareteam","permissions":0}]}],"errors":""}');

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

  describe('team creation', function() {

    it('should redirect to team manage page if success', function() {

      spyOn($state,'go');

      $httpBackend.expectPOST( url('organizations/1/teams') ).respond(200, '{"data":{"id":123,"name":"test"},"errors":null}');

      scope.createTeam('test');

      scope.$digest();

      $httpBackend.flush();

      expect($state.go).toHaveBeenCalledWith('app.organization.team', { teamId : 123, organizationId : 1 });

    });

    it('should show error if any');

  });

});