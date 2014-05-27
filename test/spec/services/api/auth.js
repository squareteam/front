/*global CryptoJS*/
'use strict';

describe('Service: ApiAuth', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiAuth;
  beforeEach(inject(function ($injector) {
    ApiAuth     = $injector.get('ApiAuth');
  }));

  it('should not be valid by default', function () {
    var auth = new ApiAuth();
    expect(auth.$isValid()).toBe(false);
  });

  it('should validate this auth', function() {
    var auth = new ApiAuth('Charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

    expect(auth.$isValid()).toBe(true);
  });

  it('should not validate this auth cause identifier is null', function() {
    var auth = new ApiAuth(null, CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

    expect(auth.$isValid()).toBe(false);
  });

  it('should not validate this auth cause token is null', function() {
    var auth = new ApiAuth('Charly', null);

    expect(auth.$isValid()).toBe(false);
  });

  it('should not validate this auth cause token is not a CryptoJS.lib.WordArray object', function() {
    var auth = new ApiAuth('Charly', {});

    expect(auth.$isValid()).toBe(false);
  });

  it('should not validate this auth cause token is not a CryptoJS.lib.WordArray object', function() {
    var auth = new ApiAuth('Charly', 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1');

    expect(auth.$isValid()).toBe(false);
  });

});
