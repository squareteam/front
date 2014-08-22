/* global provideAuth, apiURL */

'use strict';

// wait for final implementation to write tests..
describe('Controller: MyAccountCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app'));

  var MyAccountCtrl, scope, resolvePromise,
      PasswordConfirmPopin, CurrentSession, ApiSession, UserResource,
      $httpBackend, $controller, $q,
      user, url;

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

    PasswordConfirmPopin  = $injector.get('PasswordConfirmPopin');
    CurrentSession        = $injector.get('CurrentSession');
    ApiSession            = $injector.get('ApiSession');
    UserResource          = $injector.get('UserResource');

    provideAuth($injector)();

    url = apiURL($injector);

    scope = $rootScope.$new();

    user = UserResource.$buildRaw({
      id    : 1,
      name  : 'Charly',
      email : 'charly@squareteam.io'
    });

    spyOn(CurrentSession, 'getUser').and.returnValue(user);

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
      expect(scope.user).toEqual(user);
    });

  });

  describe('User profile', function() {
    it('should ask to confirm password when updating password or email', function() {
      spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
      spyOn(ApiSession, 'login').and.callFake(resolvePromise);

      $httpBackend.expectPUT( url('users/1') ).respond('');

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

      $httpBackend.expectPUT( url('users/1') ).respond('');

      scope.user.email = 'paul@squareteam.io';

      scope.updateUser();

      $httpBackend.flush();

      scope.$digest();


      expect(scope.user).toEqual(user);

    });
    it('should NOT ask to confirm password when updating pseudo', function() {

      spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
      spyOn(ApiSession, 'login').and.callFake(resolvePromise);

      $httpBackend.expectPUT( url('users/1') ).respond('');
      $httpBackend.expectGET( url('users/me') ).respond('');

      scope.user.name = 'Paul';

      scope.updateUser();

      $httpBackend.flush();

      scope.$digest();

      expect(PasswordConfirmPopin.prompt.calls.count()).toBe(0);

    });
  });

  describe('User organizations', function() {
    it('should remove organization from list after leave', function() {

      $httpBackend.expectDELETE( url('organizations/1/users/1') ).respond('');

      scope.leaveOrganization(1);

      $httpBackend.flush();

      scope.$digest();

      expect(scope.organizations.length).toBe(0);

    });
  });

});
