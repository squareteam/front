/*global CryptoJS*/
'use strict';

describe('Service: CurrentSession', function () {

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
  var CurrentSession, ApiAuth, ApiSessionStorageCookies,
      $httpBackend, $rootScope,
      successCallback, errorCallback, apiURL;

  beforeEach(inject(function ($injector) {
    CurrentSession            = $injector.get('CurrentSession');
    ApiAuth                   = $injector.get('ApiAuth');
    ApiSessionStorageCookies  = $injector.get('ApiSessionStorageCookies');

    $httpBackend              = $injector.get('$httpBackend');
    $rootScope                = $injector.get('$rootScope');

    apiURL = $injector.get('appConfig').api.url;
  }));


  it('should provide proper API', function() {
    expect(!!CurrentSession.isAuthenticated).toBe(true);
    expect(!!CurrentSession.getOrganizations).toBe(true);
    expect(!!CurrentSession.getAuth).toBe(true);
    expect(!!CurrentSession.getUser).toBe(true);
    expect(!!CurrentSession.register).toBe(true);
    expect(!!CurrentSession.unregister).toBe(true);
    expect(!!CurrentSession.save).toBe(true);
    expect(!!CurrentSession.restore).toBe(true);
  });


  describe('at initial state', function() {
    
    it('should return invalid auth', function () {
      expect(CurrentSession.getAuth().$isValid()).toBe(false);
    });

    it('should return user as null', function () {
      expect(CurrentSession.getUser()).toBe(null);
    });


  });


  describe('when authenticated', function() {

    beforeEach(function() {
      var identifier  = 'test@example.com',
          token       = 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1';

      CurrentSession.$$user = { id : 1, name : 'charly', email : 'charly.poly@live.fr'};
      CurrentSession.$$auth = new ApiAuth(identifier,CryptoJS.enc.Hex.parse(token));
    });

    it('should return valid auth', function () {
      expect(CurrentSession.getAuth().$isValid()).toBe(true);
    });

    it('should return user', function () {
      expect(CurrentSession.getUser()).toEqual({ id : 1, name : 'charly', email : 'charly.poly@live.fr'});
    });

  });

  describe('CurrentSession.save', function() {

    beforeEach(function() {
      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should fails to save when anonymous', function() {

      CurrentSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(errorCallback.calls.argsFor(0)[0]).toEqual('session.invalid');

    });

    it('CurrentSession.save', function() {

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

      spyOn(ApiSessionStorageCookies, 'store').and.returnValue(true);

      CurrentSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.count()).toEqual(0);

      expect(ApiSessionStorageCookies.store.calls.count()).toBe(1);


    });

    it('should not save cause ApiSessionStorageCookies.restore failed', function() {

      CurrentSession.$$user = { name : 'charly'};
      CurrentSession.$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

      spyOn(ApiSessionStorageCookies, 'store').and.returnValue(false);

      CurrentSession.save().then(successCallback, errorCallback);

      $rootScope.$digest(); // force deferred resolution

      expect(errorCallback.calls.count()).toEqual(1);
      expect(successCallback.calls.count()).toEqual(0);

      expect(errorCallback.calls.argsFor(0)[0]).toBe('session.storage.unable_to_store');

      expect(ApiSessionStorageCookies.store.calls.count()).toBe(1);


    });
    
  });

  describe('CurrentSession.restore', function() {

    beforeEach(function() {
      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should restore session from cookies storage', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();

      $httpBackend.expectGET(apiURL + 'user/me').respond(200, '{"data":{"name":"Charly"}}');

      CurrentSession.restore().then(successCallback, errorCallback);

      $httpBackend.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith('user:connected');

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(CurrentSession.getUser()).toEqual({
        name : 'Charly'
      });

      expect(CurrentSession.getAuth().$isValid()).toBe(true);

    });

    it('should failed silently to restore session from cookies storage', function() {

      spyOn(ApiSessionStorageCookies, 'retrieve').and.returnValue(false);

      CurrentSession.restore().then(successCallback, errorCallback);

      $rootScope.$digest();

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(successCallback.calls.argsFor(0)[0]).toBe('session.storage.no_session');

      expect(CurrentSession.getUser()).toEqual(null);

      expect(CurrentSession.getAuth().$isValid()).toBe(false);

    });

    it('should failed silently to restore session from cookies storage', function() {

      spyOn(ApiSessionStorageCookies, 'retrieve').and.returnValue(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')));
      $httpBackend.expectGET(apiURL + 'user/me').respond(401, '{"data":null,"errors":["api.not_authorized"]}');

      CurrentSession.restore().then(successCallback, errorCallback);

      $rootScope.$digest();
      $httpBackend.flush();

      expect(errorCallback.calls.any()).toEqual(false);
      expect(successCallback.calls.count()).toEqual(1);

      expect(successCallback.calls.argsFor(0)[0]).toBe('auth.invalid');

      // FIXME : check cookie has been deleted

      expect(CurrentSession.getUser()).toEqual(null);

      expect(CurrentSession.getAuth().$isValid()).toBe(false);

    });

  });


});
