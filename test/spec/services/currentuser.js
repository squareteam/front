/*global CryptoJS*/
'use strict';

describe('Service: CurrentUserProvider', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var Currentuser, ApiAuth;
  beforeEach(inject(function ($injector) {
    Currentuser = $injector.get('Currentuser');
    ApiAuth     = $injector.get('ApiAuth');
  }));

  it('should return user', function () {
    expect(Currentuser.getUser()).toBe(null);
  });

  it('should return auth', function () {
    expect(Currentuser.getAuth().isValid()).toBe(false);
  });

  it('should set user', function () {
    Currentuser.setUser({ login : 'Charly' });
    expect(Currentuser.getUser()).toEqual({ login : 'Charly' });
  });

  it('should set auth', function () {
    Currentuser.setAuth(new ApiAuth('Charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')));
    
    var auth = Currentuser.getAuth();

    expect(auth.identifier).toBe('Charly');
    expect(auth.token.toString()).toBe('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');
  });

});
