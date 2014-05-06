/*global CryptoJS*/
'use strict';

describe('Service: ApiSessionStorageCookies', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiSessionStorageCookies, ApiAuth,
      appConfig,
      $cookies;


  beforeEach(inject(function ($injector) {
    ApiSessionStorageCookies  = $injector.get('ApiSessionStorageCookies');
    ApiAuth                   = $injector.get('ApiAuth');
    
    appConfig                 = $injector.get('appConfig');
    $cookies                  = $injector.get('$cookies');
  }));

  it('should expose correct Storage API', function () {
    expect(!!ApiSessionStorageCookies.retrieve).toBe(true);
    expect(!!ApiSessionStorageCookies.store).toBe(true);
    expect(!!ApiSessionStorageCookies.empty).toBe(true);
    expect(!!ApiSessionStorageCookies.destroy).toBe(true);
  });

  describe('ApiSessionStorageCookies.empty', function() {
    
    it('should return true', function() {
      expect(ApiSessionStorageCookies.empty()).toBe(true);
    });

    it('should return false', function() {

      $cookies[appConfig.api.storageNS] = '';

      expect(ApiSessionStorageCookies.empty()).toBe(false);
    });

  });

  describe('ApiSessionStorageCookies.store', function() {
    
    it('should store auth to cookies', function() {

      var auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

      auth.$$validatedFromServer = true;

      ApiSessionStorageCookies.store(auth);

      expect($cookies[appConfig.api.storageNS]).toBe('charly:a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');

    });

    it('should not store invalid auth', function() {
      var auth = new ApiAuth('charly', 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');

      ApiSessionStorageCookies.store(auth);

      expect($cookies[appConfig.api.storageNS]).toBe(undefined);

    });

  });

  describe('ApiSessionStorageCookies.destroy', function() {
    
    it('should remove auth from cookies', function() {
      $cookies[appConfig.api.storageNS] = 'charly:a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1';

      ApiSessionStorageCookies.destroy();

      expect($cookies[appConfig.api.storageNS]).toBe(undefined);
    });
  
  });

  describe('ApiSessionStorageCookies.retrieve', function() {
    
    it('should retrieve auth stored in cookies', function() {
      $cookies[appConfig.api.storageNS] = 'charly:a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1';

      expect(ApiSessionStorageCookies.retrieve().$$isValid()).toBe(true);
      expect(ApiSessionStorageCookies.retrieve().isValidatedFromServer()).toBe(false);
      expect(ApiSessionStorageCookies.retrieve().identifier).toBe('charly');
      expect(ApiSessionStorageCookies.retrieve().token).toEqual(CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

    });

    it('should not retrieve invalid auth stored in cookies', function() {

      $cookies[appConfig.api.storageNS] = 'charly';
      expect(ApiSessionStorageCookies.retrieve()).toBe(false);

    });

    it('should return false cause no auth stored in cookies', function() {

      expect(ApiSessionStorageCookies.retrieve()).toBe(false);

    });

  });

});
