/*global CryptoJS*/
'use strict';

describe('Service: ApiCrypto', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiCrypto, data = {};
  beforeEach(inject(function ($injector) {
    ApiCrypto = $injector.get('ApiCrypto');

    data.auth = {
      identifier  : 'test@example.com',
      password    : 'test',
      salt1       : CryptoJS.enc.Hex.parse('36b26d1ee22bb35e'),
      salt2       : CryptoJS.enc.Hex.parse('a5e28ef7bcb5605b')
    };

    data.request = {
      method    : 'GET',
      url       : 'http://localhost:1551/api/users/me',
      data      : {},
      timestamp : '1393369116',
      headers   : {}
    };

    data.token = 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1';

    $injector.get('Currentuser').setAuth({
      identifier : data.auth.identifier,
      token      : CryptoJS.enc.Hex.parse(data.token)
    });


    // hack the Date.now to return correct timestamp..
    // TODO : provide a Date module ?!
    //          -> I think it's overkill
    Date.now = function() {
      return 1393369116000;
    };
  }));

  it('should expose API', function () {
    expect(!!ApiCrypto.generateToken).toBe(true);
    expect(!!ApiCrypto.transformRequest).toBe(true);
  });

  it('should generate correct pbkdf', function () {
    expect(ApiCrypto.generateToken(data.auth.identifier, data.auth.password, data.auth.salt1, data.auth.salt2).toString()).toBe(data.token);
  });

  it('should generate correct hash', function () {
    var headers = ApiCrypto.transformRequest(data.request).headers;

    expect(headers['St-Timestamp']).toBe(1393369116);
    expect(headers['St-Identifier']).toBe(data.auth.identifier);
    expect(headers['St-Hash']).toBe('286d86d5ca50ca07d4a2e70a9831e913df82a9c550b30fd1a33a1d061e80828f');

  });

  // TODO : test with data payload !

});
