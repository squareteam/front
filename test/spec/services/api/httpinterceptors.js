/*global CryptoJS*/
'use strict';

describe('Service: ApiHttpInterceptors', function () {

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
  var ApiHttpInterceptors, ApiAuth,
      $http, $httpBackend,
      apiURL;

  beforeEach(inject(function ($injector) {
    ApiHttpInterceptors = $injector.get('ApiHttpInterceptors');
    ApiAuth             = $injector.get('ApiAuth');

    $http               = $injector.get('$http');
    $httpBackend        = $injector.get('$httpBackend');

    apiURL              = $injector.get('appConfig').api.url;

    $injector.get('Currentuser').setAuth(new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1')), true);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should do not change request url', function () {
    $httpBackend.expectGET('/auth.py').respond(200, '');
    $http.get('/auth.py').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

  it('should change url with api url', function () {
    $httpBackend.expectGET(apiURL + 'login').respond(200, '');
    $http.get('api://login').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

  it('should change url with api url and add headers', function () {
    $httpBackend.expectGET(apiURL + 'users', {'Accept':'application/json, text/plain, */*','St-Identifier':'charly','St-Timestamp':1393369116,'St-Hash':'6a45267d89bf7ec8f068356e571656f9e64de0803bba2e5d8f2ee268182c0ab7', 'X-Requested-With':'XMLHttpRequest'}).respond(200, '');
    $http.get('apis://users').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

});
