/*global CryptoJS*/
'use strict';

// TODO : test bad JSON response

describe('Service: ApiSession', function () {

  // load the service's module
  beforeEach(module('squareteam.app', function ($provide) {
    $provide.service('ApiSessionStorageCookies', function() {

      this.retrieve = function() {
        return new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));
      };
      this.store = function() {
        return true;
      };
      this.destroy = function() {};
      this.empty = function() {
        return false;
      };

    });
  }));

  // instantiate service
  var ApiSession, Currentuser, ApiAuth, ApiSessionStorageCookies,
      $http, $httpBackend, $rootScope,
      apiURL, successCallback, errorCallback;

  beforeEach(inject(function ($injector) {
    ApiSession                = $injector.get('ApiSession');
    Currentuser               = $injector.get('Currentuser');
    ApiAuth                   = $injector.get('ApiAuth');
    ApiSessionStorageCookies  = $injector.get('ApiSessionStorageCookies');

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
    expect(!!ApiSession.isAuthenticated).toBe(true);
    expect(!!ApiSession.login).toBe(true);
    expect(!!ApiSession.logout).toBe(true);
    expect(!!ApiSession.save).toBe(true);
    expect(!!ApiSession.restore).toBe(true);
    expect(!!ApiSession.ackAuth).toBe(true);
    expect(ApiSession.$pristine).toBe(true);
  });

  it('should have a anonymous user by default', function() {

    expect(ApiSession.isAuthenticated()).toBe(false);
    expect(Currentuser.getAuth().isValidatedFromServer()).toBe(false);

  });

  describe('ApiSession.login', function() {
    
    it('should fail to login cause login is incorrect', function() {
      $httpBackend.expectPUT(apiURL + 'login').respond(400, '{"errors":["identifier is not valid"],"data":null}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(successCallback.calls.any()).toEqual(false);
      expect(errorCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);
      
      expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_login');
    });

    it('should fail to login cause password is incorrect', function() {
      $httpBackend.expectPUT(apiURL + 'login').respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(apiURL + 'user/me').respond(401, '{"data":null,"errors":["auth is not valid"]}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(ApiSession.$pristine).toBe(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_password');
    });

    it('should fail to login cause salts returned by server is incorrect', function() {
      $httpBackend.expectPUT(apiURL + 'login').respond(200, '{"data":{"salt1":"z","salt2":""}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(ApiSession.$pristine).toBe(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.response_malformed');
    });

    it('should fail to login cause API is down', function() {


      $httpBackend.expectPUT(apiURL + 'login').respond(503, '{"data":{"salt1":"z","salt2":""}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(ApiSession.$pristine).toBe(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.not_available');

    });

    it('should login', function() {
      spyOn($rootScope, '$broadcast');

      $httpBackend.expectPUT(apiURL + 'login')  .respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(apiURL + 'user/me').respond(200, '{"data":{"name":"Charly"}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);

      expect(Currentuser.getUser()).toEqual({
        name : 'Charly'
      });

      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(true);

    });

    it('if already and connected, it should logout and login', function() {
      spyOn($rootScope, '$broadcast');

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);


      $httpBackend.expectGET(apiURL + 'logout') .respond(200, '');
      $httpBackend.expectPUT(apiURL + 'login')  .respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(apiURL + 'user/me').respond(200, '{"data":{"name":"Charly"}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);

      expect(Currentuser.getUser()).toEqual({
        name : 'Charly'
      });

      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(true);

    });

  });

  describe('ApiSession.logout', function() {
    
    it('should fails to logout when anonymous', function() {

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(Currentuser.isAuthenticated()).toBe(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

    });

    it('should fails to logout when api is down', function() {

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);


      $httpBackend.expectGET(apiURL + 'logout').respond(500, '');

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(Currentuser.isAuthenticated()).toBe(true);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.not_available');

    });

    it('should logout', function() {

      spyOn($rootScope, '$broadcast');
      spyOn(ApiSessionStorageCookies, 'destroy');

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);


      $httpBackend.expectGET(apiURL + 'logout').respond(200, '');

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // first force deferred to settle

      $httpBackend.flush(); // then force http request to complete

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect(ApiSessionStorageCookies.destroy.calls.count()).toBe(1);

      expect(Currentuser.isAuthenticated()).toBe(false);

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);


    });

    it('should logout without destroy from storage', function() {

      spyOn($rootScope, '$broadcast');
      spyOn(ApiSessionStorageCookies, 'destroy');

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);


      $httpBackend.expectGET(apiURL + 'logout').respond(200, '');

      ApiSession.logout(false).then(successCallback, errorCallback);

      $rootScope.$digest(); // first force deferred to settle

      $httpBackend.flush(); // then force http request to complete

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect(ApiSessionStorageCookies.destroy.calls.count()).toBe(0);

      expect(Currentuser.isAuthenticated()).toBe(false);

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);


    });

  });

  describe('ApiSession.save', function() {
    
    it('should fails to save when anonymous', function() {

      ApiSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

    });

    it('should save', function() {

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);

      spyOn(ApiSessionStorageCookies, 'store').and.returnValue(true);

      ApiSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);

      expect(ApiSessionStorageCookies.store.calls.count()).toBe(1);


    });

    it('should not save cause ApiSessionStorageCookies.restore failed', function() {

      Currentuser.setUser({ name : 'charly'});
      Currentuser.setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);

      spyOn(ApiSessionStorageCookies, 'store').and.returnValue(false);

      ApiSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(errorCallback.calls.argsFor(0)[0]).toBe('session.storage.unable_to_store');

      expect(ApiSessionStorageCookies.store.calls.count()).toBe(1);


    });
    
  });

  describe('ApiSession.restore', function() {

    it('should restore session from cookies storage', function() {
      spyOn($rootScope, '$broadcast');

      $httpBackend.expectGET(apiURL + 'user/me').respond(200, '{"data":{"name":"Charly"}}');

      ApiSession.restore().then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);

      expect(Currentuser.getUser()).toEqual({
        name : 'Charly'
      });

      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(true);

    });

    it('should failed silently to restore session from cookies storage', function() {

      spyOn(ApiSessionStorageCookies, 'retrieve').and.returnValue(false);

      ApiSession.restore().then(successCallback, errorCallback);

      $rootScope.$digest();

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);

      expect(successCallback.calls.argsFor(0)[0]).toBe('session.storage.no_session');

      expect(Currentuser.getUser()).toEqual(null);

      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(false);

    });

    it('should failed silently to restore session from cookies storage', function() {

      spyOn(ApiSessionStorageCookies, 'retrieve').and.returnValue(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')));
      $httpBackend.expectGET(apiURL + 'user/me').respond(401, '{"data":null,"errors":["api.not_authorized"]}');

      ApiSession.restore().then(successCallback, errorCallback);

      $rootScope.$digest();
      $httpBackend.flush();

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(ApiSession.$pristine).toBe(false);

      expect(successCallback.calls.argsFor(0)[0]).toBe('auth.invalid');

      expect(Currentuser.getUser()).toEqual(null);

      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(false);

    });

  });
});
