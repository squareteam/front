/*global CryptoJS, apiURL */
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
  var ApiSession, CurrentSession, ApiAuth, ApiSessionStorageCookies,
      $http, $httpBackend, $rootScope, $q,
      url, successCallback, errorCallback;

  beforeEach(inject(function ($injector) {
    ApiSession                = $injector.get('ApiSession');
    CurrentSession            = $injector.get('CurrentSession');
    ApiAuth                   = $injector.get('ApiAuth');
    ApiSessionStorageCookies  = $injector.get('ApiSessionStorageCookies');

    $http               = $injector.get('$http');
    $httpBackend        = $injector.get('$httpBackend');
    $rootScope          = $injector.get('$rootScope');
    $q                  = $injector.get('$q');

    url = apiURL($injector);
  }));

  function resolvePromise() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  }

  beforeEach(function() {
    successCallback = jasmine.createSpy('success');
    errorCallback = jasmine.createSpy('error');
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should provide correct API', function () {
    expect(!!ApiSession.login).toBe(true);
    expect(!!ApiSession.logout).toBe(true);
  });

  describe('ApiSession.login', function() {
    
    it('should fail to login cause login is incorrect', function() {
      $httpBackend.expectPUT( url('login') ).respond(400, '{"errors":["identifier is not valid"],"data":null}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(successCallback.calls.any()).toEqual(false);
      expect(errorCallback.calls.count()).toEqual(1);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_login');
    });

    it('should fail to login cause password is incorrect', function() {
      $httpBackend.expectPUT( url('login') ).respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET( url('users/me') ).respond(401, '{"data":null,"errors":["auth is not valid"]}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('auth.bad_password');
    });

    it('should fail to login cause salts returned by server is incorrect', function() {
      $httpBackend.expectPUT( url('login') ).respond(200, '{"data":{"salt1":"z","salt2":""}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.response_malformed');
    });

    it('should fail to login cause API is down', function() {


      $httpBackend.expectPUT( url('login') ).respond(503, '{"data":{"salt1":"z","salt2":""}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.any()).toEqual(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.not_available');

    });

    it('should login', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(CurrentSession, '$$reloadUserPermissions').and.callFake(resolvePromise);

      $httpBackend.expectPUT( url('login') )  .respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET( url('users/me') ).respond(200, '{"data":{"name":"Charly"}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(CurrentSession.getUser().name).toEqual('Charly');

      expect(CurrentSession.isAuthenticated()).toBe(true);

    });

    it('if already and connected, it should logout and login', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(CurrentSession, '$$reloadUserPermissions').and.callFake(resolvePromise);

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));


      $httpBackend.expectGET( url('logout') ).respond(200, '');
      $httpBackend.expectPUT( url('login') ).respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET( url('users/me') ).respond(200, '{"data":{"name":"Charly"}}');

      ApiSession.login('test@test.fr', 'test').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(CurrentSession.getUser().name).toEqual('Charly');

      expect(CurrentSession.getAuth().$isValid()).toBe(true);

    });

  });

  describe('ApiSession.logout', function() {
    
    it('should fails to logout when anonymous', function() {

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(CurrentSession.isAuthenticated()).toBe(false);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

    });

    it('should fails to logout when api is down', function() {

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));


      $httpBackend.expectGET( url('logout') ).respond(500, '');

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      $httpBackend.flush();

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(CurrentSession.isAuthenticated()).toBe(true);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('api.not_available');

    });

    it('should logout', function() {

      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(ApiSessionStorageCookies, 'destroy');

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));


      $httpBackend.expectGET( url('logout') ).respond(200, '');

      ApiSession.logout().then(successCallback, errorCallback);

      $rootScope.$digest(); // first force deferred to settle

      $httpBackend.flush(); // then force http request to complete

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect(ApiSessionStorageCookies.destroy.calls.count()).toBe(1);

      expect(CurrentSession.isAuthenticated()).toBe(false);

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);


    });

    it('should logout without destroy from storage', function() {

      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(ApiSessionStorageCookies, 'destroy');

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));


      $httpBackend.expectGET( url('logout') ).respond(200, '');

      ApiSession.logout(false).then(successCallback, errorCallback);

      $rootScope.$digest(); // first force deferred to settle

      $httpBackend.flush(); // then force http request to complete

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:disconnected');
      expect(ApiSessionStorageCookies.destroy.calls.count()).toBe(0);

      expect(CurrentSession.isAuthenticated()).toBe(false);

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);


    });

  });

});
