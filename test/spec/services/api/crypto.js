/*global CryptoJS*/
'use strict';

describe('Service: ApiCrypto', function () {

  // load the service's module
  beforeEach(module('squareteam.app', function($provide) {
    $provide.value('appConfig', {
      api : {
        host : 'http://127.0.0.1:1551/api/',
        path : '',
        url  : 'http://127.0.0.1:1551/api/',
        storageNS : 'ST_SESSION'
      }
    });
    // override value to match ST ruby API spec
  }));

  // instantiate service
  var ApiCrypto, ApiAuth, CurrentSession,
      appConfig,
      data = {};
  
  beforeEach(inject(function ($injector) {
    ApiCrypto       = $injector.get('ApiCrypto');
    ApiAuth         = $injector.get('ApiAuth');
    CurrentSession  = $injector.get('CurrentSession');
    appConfig       = $injector.get('appConfig');

    data.auth = {
      identifier  : 'test@example.com',
      password    : 'test',
      salt1       : CryptoJS.enc.Hex.parse('36b26d1ee22bb35e'),
      salt2       : CryptoJS.enc.Hex.parse('a5e28ef7bcb5605b')
    };

    data.request = {
      method    : 'GET',
      url       : appConfig.api.url + 'users/me',
      data      : '',
      timestamp : '1393369116',
      headers   : {}
    };

    data.token = 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1';

    CurrentSession.$$user = { id : 1, name : 'charly', email : 'charly.poly@live.fr'};
    CurrentSession.$$auth = new ApiAuth(data.auth.identifier,CryptoJS.enc.Hex.parse(data.token));


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
    expect(!!ApiCrypto.generateHeaders).toBe(true);
  });

  it('should generate correct pbkdf', function () {
    expect(ApiCrypto.generateToken(data.auth.identifier, data.auth.password, data.auth.salt1, data.auth.salt2).toString()).toBe(data.token);
  });

  it('should generate correct hash (/w no data)', function () {
    var headers = ApiCrypto.transformRequest(data.request).headers;

    expect(headers['St-Timestamp']).toBe(1393369116);
    expect(headers['St-Identifier']).toBe(data.auth.identifier);
    expect(headers['St-Hash']).toBe('286d86d5ca50ca07d4a2e70a9831e913df82a9c550b30fd1a33a1d061e80828f');

  });

  it('should generate correct hash (/w data)', function () {
    data.request.data = {test : 1};
    var headers = ApiCrypto.transformRequest(data.request).headers;

    expect(headers['St-Timestamp']).toBe(1393369116);
    expect(headers['St-Identifier']).toBe(data.auth.identifier);
    expect(headers['St-Hash']).toBe('f0036e0d6e2791030db39410edfbc8fd31fd59360a5c7fabf177e1f5a70fcac3');

  });

  it('should fails to generateHeaders when CurrentSession is anonymous', function() {
    CurrentSession.$$auth = new ApiAuth();

    expect(function() {
      ApiCrypto.transformRequest(data.request);
    }).toThrowError();
  });

});
