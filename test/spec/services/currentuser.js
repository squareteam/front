/*global CryptoJS*/
'use strict';

describe('Service: CurrentUser', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var Currentuser, ApiAuth;
  beforeEach(inject(function ($injector) {
    Currentuser = $injector.get('Currentuser');
    ApiAuth     = $injector.get('ApiAuth');
  }));


  describe('Authentication', function() {
    
    it('should return auth', function () {
      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(false);
    });


    it('should set auth (not validated)', function () {
      Currentuser.setAuth(new ApiAuth('Charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')));
      
      var auth = Currentuser.getAuth();

      expect(auth.identifier).toBe('Charly');
      expect(auth.token.toString()).toBe('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');
      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(false);
    });

    it('should set auth (validated)', function () {
      Currentuser.setAuth(new ApiAuth('Charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);
      
      var auth = Currentuser.getAuth();

      expect(auth.identifier).toBe('Charly');
      expect(auth.token.toString()).toBe('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');
      expect(Currentuser.getAuth().isValidatedFromServer()).toBe(true);
    });

  });


  describe('User', function() {
    
    it('should return user', function () {
      expect(Currentuser.getUser()).toBe(null);
    });

    it('should set user', function () {
      Currentuser.setUser({ login : 'Charly' });
      expect(Currentuser.getUser()).toEqual({ login : 'Charly' });
    });

  });

  describe('Organizations', function() {
    

    it('by default getOrganizations should be an empty array', function() {
      expect(Currentuser.getOrganizations().length).toBe(0);
    });

    it('by default getCurrentOrganization should be null', function() {
      expect(Currentuser.getCurrentOrganization()).toBe(null);
    });

    it('should set current organization', function() {
      Currentuser.setCurrentOrganization({name : 'test'});

      expect(Currentuser.getCurrentOrganization()).toEqual({name : 'test'});
    });

    it('should set user organizations', function() {
      Currentuser.setOrganizations([
        {name : 'test'},
        {name : 'test 2'}
      ]);

      expect(Currentuser.getOrganizations()).toEqual([
        {name : 'test'},
        {name : 'test 2'}
      ]);

      expect(Currentuser.getCurrentOrganization()).toEqual({name : 'test'});
    });

  });


});
