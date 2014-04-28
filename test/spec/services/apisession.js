'use strict';

describe('Service: ApiSession', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiSession, Currentuser,
      $http, $httpBackend, $rootScope,
      apiURL, successCallback, errorCallback;

  beforeEach(inject(function ($injector) {
    ApiSession          = $injector.get('ApiSession');
    Currentuser         = $injector.get('Currentuser');

    $http               = $injector.get('$http');
    $httpBackend        = $injector.get('$httpBackend');
    $rootScope          = $injector.get('$rootScope');

    apiURL              = $injector.get('appConfig').api.url;
  }));

  beforeEach(function() {
    successCallback = jasmine.createSpy('success');
    errorCallback = jasmine.createSpy('error');
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should provide correct API', function () {
    expect(!!ApiSession.isAnonymous).toBe(true);
    expect(!!ApiSession.login).toBe(true);
    expect(!!ApiSession.logout).toBe(true);
    expect(!!ApiSession.save).toBe(true);
    expect(!!ApiSession.restore).toBe(true);
    expect(!!ApiSession.ackAuth).toBe(true);
  });

  it('should have a anonymous by default', function() {

    expect(ApiSession.isAnonymous()).toBe(true);

  });

  it('should fail to login cause login is incorrect', function() {
    $httpBackend.expectGET(apiURL + 'login').respond(404, '');

    ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

    $httpBackend.flush();

    expect(successCallback.calls.any()).toEqual(false);
    expect(errorCallback.calls.count()).toEqual(1);
    
    expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_login');
  });

  it('should fail to login cause password is incorrect', function() {
    $httpBackend.expectGET(apiURL + 'login').respond(200, '{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}');
    $httpBackend.expectGET(apiURL + 'user/me').respond(401, '');

    ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

    $httpBackend.flush();

    expect(errorCallback.calls.count()).toEqual(1);
    expect(successCallback.calls.any()).toEqual(false);

    expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_password');
  });

  it('should fail to login cause salts returned by server is incorrect', function() {
    $httpBackend.expectGET(apiURL + 'login').respond(200, '{"salt1":"z","salt2":""}');

    ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

    $httpBackend.flush();

    expect(errorCallback.calls.count()).toEqual(1);
    expect(successCallback.calls.any()).toEqual(false);

    expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.response_malformed');
  });

  it('should fail to login cause API is down (500, 503)');

  it('should fails to logout when anonymous', function() {

    ApiSession.logout().then(successCallback, errorCallback);

    $rootScope.$digest(); // force deferred resolution

    expect(errorCallback.calls.count()).toEqual(1);
    expect(successCallback.calls.count()).toEqual(0);

    expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

  });

  it('should fails to save when anonymous', function() {

    ApiSession.save().then(successCallback, errorCallback);

    $rootScope.$digest(); // force deferred resolution

    expect(errorCallback.calls.count()).toEqual(1);
    expect(successCallback.calls.count()).toEqual(0);

    expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

  });

  describe('ApiSession.login', function() {


    it('should login', function() {
      $httpBackend.expectGET(apiURL + 'login').respond(200, '{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}');
      $httpBackend.expectGET(apiURL + 'user/me').respond(200, '{"user":{"name":"Charly"}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(Currentuser.getUser()).toEqual({
        name : 'Charly'
      });

      expect(Currentuser.getAuth().isValid()).toBe(true);

    });
  });

});
