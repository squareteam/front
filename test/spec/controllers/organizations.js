/* global apiURL, provideAuth */

'use strict';

describe('Controller: Organizations', function () {

  beforeEach(module('squareteam.app'));

  var Organizations, ApiSession, url,
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

    $httpBackend.expectGET( url('users/1/organizations') ).respond(200, '{"data":[{"id":1,"name":"FMB","description":"test test"}]}');

    scope = $rootScope.$new();
    Organizations = $controller('Organizations', {
      $scope              : scope,
      currentOrganization : {
        id : 1
      }
    });

    scope.$digest();

    $httpBackend.flush();

  }));

  it('should expose user organizations', function() {

    scope.$digest();

    expect(scope.organizations.length).toEqual(1);

  });

  it('should remove organization from list after leave', function() {

    $httpBackend.expectDELETE( url('organizations/1/users/1') ).respond('');

    scope.leaveOrganization(1);

    $httpBackend.flush();

    scope.$digest();

    expect(scope.organizations.length).toBe(0);

  });

});