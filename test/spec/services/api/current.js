/*global CryptoJS*/
'use strict';

describe('Service: CurrentSession', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var CurrentSession, ApiAuth;
  beforeEach(inject(function ($injector) {
    CurrentSession  = $injector.get('CurrentSession');
    ApiAuth         = $injector.get('ApiAuth');
  }));


  it('should provide proper API', function() {
    expect(!!CurrentSession.isAuthenticated).toBe(true);
    expect(!!CurrentSession.getOrganizations).toBe(true);
    expect(!!CurrentSession.getAuth).toBe(true);
    expect(!!CurrentSession.getUser).toBe(true);
    expect(!!CurrentSession.$register).toBe(true);
    expect(!!CurrentSession.$unregister).toBe(true);
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


});
