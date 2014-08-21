/* global provideAuth */

'use strict';

// wait for final implementation to write tests..
describe('Controller: MyAccountCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app'));

  var MyAccountCtrl, scope, resolvePromise,
      appConfig, PasswordConfirmPopin, CurrentSession, ApiSession, UserResource,
      $httpBackend, $controller, $q, $location,
      user;

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
    $location             = $injector.get('$location');

    appConfig             = $injector.get('appConfig');
    PasswordConfirmPopin  = $injector.get('PasswordConfirmPopin');
    CurrentSession        = $injector.get('CurrentSession');
    ApiSession            = $injector.get('ApiSession');
    UserResource          = $injector.get('UserResource');

    provideAuth($injector)();

    scope = $rootScope.$new();

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

  }));


  describe('with a squareteam account', function() {

    beforeEach(function () {
      user = UserResource.$buildRaw({
        id        : 1,
        name      : 'Charly',
        email     : 'charly@squareteam.io',
        provider  : 'squareteam'
      });

      CurrentSession.$$user = user;
      spyOn(CurrentSession, 'getUser').and.returnValue(user);

      MyAccountCtrl = $controller('MyAccountCtrl', {
        $scope: scope
      });

      scope.$digest();
    });

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
        spyOn(user, '$dirty').and.callFake(function(prop) {
          return prop === 'email';
        });

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
        spyOn(user, '$dirty').and.callFake(function(prop) {
          return prop === 'email';
        });

        $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond('');

        scope.user.email = 'paul@squareteam.io';

        scope.updateUser();

        $httpBackend.flush();

        scope.$digest();


        expect(scope.user).toEqual(user);

      });

      it('should rollback changes if update failed', function() {

        spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
        spyOn(user, '$dirty').and.callFake(function(prop) {
          return prop === 'email';
        });

        $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond(500, '');

        scope.user.email = 'paul@squareteam.io';

        scope.updateUser();

        $httpBackend.flush();

        scope.$digest();


        expect(scope.user).toEqual(user);

      });

      it('should NOT ask to confirm password when updating pseudo', function() {

        spyOn(PasswordConfirmPopin, 'prompt').and.callFake(resolvePromise);
        spyOn(ApiSession, 'login').and.callFake(resolvePromise);
        spyOn(user, '$dirty').and.callFake(function(prop) {
          return prop === 'name';
        });

        $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond('');
        $httpBackend.expectGET(appConfig.api.url + 'user/me').respond('');

        scope.user.name = 'Paul';

        scope.updateUser();

        $httpBackend.flush();

        scope.$digest();

        expect(PasswordConfirmPopin.prompt.calls.count()).toBe(0);

      });
    });

    describe('User organizations', function() {
      it('should remove organization from list after leave', function() {

        $httpBackend.expectDELETE(appConfig.api.url + 'organizations/1/user/1').respond('');

        scope.leaveOrganization(1);

        $httpBackend.flush();

        scope.$digest();

        expect(scope.organizations.length).toBe(0);

      });
    });

  });

  describe('with a Github account (OAuth Account)', function() {

    beforeEach(function () {
      user = UserResource.$buildRaw({
        id        : 1,
        name      : 'Charly',
        email     : 'charly@squareteam.io',
        provider  : 'github'
      });

      CurrentSession.$$user = user;
      spyOn(CurrentSession, 'getUser').and.returnValue(user);

      MyAccountCtrl = $controller('MyAccountCtrl', {
        $scope: scope
      });

      scope.$digest();
    });

    describe('at initial state', function() {

      it('should display that the account is linked to Github');

    });

    describe('User profile', function() {

      describe('when updating email', function() {

        it('it should redirect to "/api/auth/github" if success', function() {

          spyOn($location, 'url');
          spyOn(user, '$dirty').and.callFake(function(prop) {
            return prop === 'email';
          });

          $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond(200, '');

          scope.user.email = 'paul@squareteam.io';

          scope.updateUser();

          $httpBackend.flush();

          scope.$digest();


          expect($location.url).toHaveBeenCalledWith(appConfig.api.oauth.github.endpoint);

        });

      });

    });

  });

  describe('with a Unknown OAuth account', function() {

    beforeEach(function () {
      user = UserResource.$buildRaw({
        id        : 1,
        name      : 'Charly',
        email     : 'charly@squareteam.io',
        provider  : 'unknown_service'
      });

      CurrentSession.$$user = user;
      spyOn(CurrentSession, 'getUser').and.returnValue(user);

      MyAccountCtrl = $controller('MyAccountCtrl', {
        $scope: scope
      });

      scope.$digest();
    });


    it('it should unregister current session and reload', function() {

        spyOn($location, 'path');
        spyOn(CurrentSession, 'unregister');
        spyOn(user, '$dirty').and.callFake(function(prop) {
          return prop === 'email';
        });

        $httpBackend.expectPUT(appConfig.api.url + 'users/1').respond(200, '');

        scope.user.email = 'paul@squareteam.io';

        scope.updateUser();

        $httpBackend.flush();

        scope.$digest();

        expect(CurrentSession.unregister.calls.count()).toBe(1);
        expect($location.path).toHaveBeenCalledWith('/');

      });

  });

});
