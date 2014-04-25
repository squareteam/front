'use strict';

describe('Service: CurrentUserProvider', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var Currentuser;
  beforeEach(inject(function ($injector) {
    Currentuser = $injector.get('Currentuser');
  }));

  it('should return user', function () {
    expect(Currentuser.getUser()).toBe(null);
  });

  it('should return auth', function () {
    expect(Currentuser.getAuth()).toEqual({
      'identifier'  : 'anonymous',
      'token'       : ''
    });
  });

  it('should return user and auth', function () {
    expect(Currentuser.getAll()).toEqual({
      user : null,
      auth : {
        'identifier'  : 'anonymous',
        'token'       : ''
      }
    });
  });

  it('should set user', function () {
    Currentuser.setUser({ login : 'Charly' });
    expect(Currentuser.getUser()).toEqual({ login : 'Charly' });
  });

  it('should set auth', function () {
    Currentuser.setAuth({
      'identifier'  : 'Charly',
      'token'       : 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'
    });
    expect(Currentuser.getAuth()).toEqual({
      'identifier'  : 'Charly',
      'token'       : 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'
    });
  });

});
