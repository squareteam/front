'use strict';

describe('Service: ApiHttpInterceptors', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiHttpInterceptors, $http, $httpBackend, apiURL;
  beforeEach(inject(function ($injector) {
    ApiHttpInterceptors = $injector.get('ApiHttpInterceptors');
    $http               = $injector.get('$http');
    $httpBackend        = $injector.get('$httpBackend');

    apiURL              = $injector.get('appConfig').api.url;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should do nothing', function () {
    $httpBackend.expectGET('/auth.py').respond(200, '');
    $http.get('/auth.py').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

  it('should change url with api url', function () {
    $httpBackend.expectGET(apiURL + 'logout').respond(200, '');
    $http.get('api://logout').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

  it('should change url with api url and add headers', function () {
    $httpBackend.expectGET(apiURL + 'users', {'Accept':'application/json, text/plain, */*','St-Identifier':'anonymous','St-Timestamp':1393369116,'St-Hash':'ae5efb95fdd0fcfea070a1aa04d6899fefd1ecb71de314bdb57f97197b7f165c'}).respond(200, '');
    $http.get('apis://users').success(function(/*data, status, headers*/) {
    });

    $httpBackend.flush();
  });

});
