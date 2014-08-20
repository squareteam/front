/* global provideAuth */

'use strict';

// wait for final implementation to write tests..
describe('Controller: MyAccountCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app'));

  var MyAccountCtrl, scope, resolvePromise,
      appConfig, PasswordConfirmPopin, CurrentSession, ApiSession,
      $httpBackend, $controller, $q;

  resolvePromise = function() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $injector) {
    $httpBackend          = $injector.get('$httpBackend');
    $controller           = $injector.get('$controller');
    $q                    = $injector.get('$q');

    appConfig             = $injector.get('appConfig');
    PasswordConfirmPopin  = $injector.get('PasswordConfirmPopin');
    CurrentSession        = $injector.get('CurrentSession');
    ApiSession            = $injector.get('ApiSession');

    provideAuth($injector)();

    scope = $rootScope.$new();

    spyOn(CurrentSession, 'getUser').and.returnValue({
      id    : 1,
      name  : 'Charly',
      email : 'charly@squareteam.io'
    });

    spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve([
        {
          id : 1,
          name : 'FMB'
        }
      ]);
      return deferred.promise;
    });

    MyAccountCtrl = $controller('MyAccountCtrl', {
      $scope: scope
    });

    scope.$digest();
  }));

  describe('at initial state', function() {

    it('should provide organizations list as $scope.organizations', function() {
      expect(scope.organizations.length).toBe(1);
    });

    it('should provide current user as $scope.user', function() {
      expect(scope.user).toEqual({
        id    : 1,
        name  : 'Charly',
        email : 'charly@squareteam.io'
      });
    });

  });

  describe('User profile', function() {
    it('should ask to confirm password when updating password or email', function() {
      spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
      spyOn(ApiSession, 'login').and.callFake(resolvePromise);

      $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond('');

      scope.user.email = 'paul@squareteam.io';

      scope.updateUser();

      $httpBackend.flush();

      scope.$digest();

      expect(PasswordConfirmPopin.prompt.calls.count()).toBe(1);

    });
    it('should rollback changes if confirm password failed', function() {

      spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
      spyOn(ApiSession, 'login').and.callFake(function() {
        return $q.reject();
      });

      $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond('');

      scope.user.email = 'paul@squareteam.io';

      scope.updateUser();

      $httpBackend.flush();

      scope.$digest();


      expect(scope.user).toEqual({
        id    : 1,
        name  : 'Charly',
        email : 'charly@squareteam.io'
      });

    });
    it('should NOT ask to confirm password when updating pseudo', function() {

      spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
      spyOn(ApiSession, 'login').and.callFake(resolvePromise);

      $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond('');
      $httpBackend.expectGET(appConfig.api.url + 'users/me').respond('');

      scope.user.name = 'Paul';

      scope.updateUser();

      $httpBackend.flush();

      scope.$digest();

      expect(PasswordConfirmPopin.prompt.calls.count()).toBe(0);

    });
  });

  describe('User organizations', function() {
    it('should remove organization from list after leave', function() {

      $httpBackend.expectDELETE(appConfig.api.url + 'organizations/1/users/1').respond('');

      scope.leaveOrganization(1);

      $httpBackend.flush();

      scope.$digest();

      expect(scope.organizations.length).toBe(0);

    });
  });

});
