/* global provideAuth, apiResponseAsString */
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
  var ApiHttpInterceptors, ApiAuth, ApiErrors,
      $http, $httpBackend,
      apiURL,
      REQUEST_HEADERS = {
      'Accept':'application/json, text/plain, */*',
      'St-Identifier':'charly.poly@live.fr',
      'St-Timestamp':1393369116,
      'St-Hash':'6a45267d89bf7ec8f068356e571656f9e64de0803bba2e5d8f2ee268182c0ab7',
      'X-Requested-With':'XMLHttpRequest'
    };

  beforeEach(inject(function ($injector) {
    ApiHttpInterceptors = $injector.get('ApiHttpInterceptors');
    ApiAuth             = $injector.get('ApiAuth');
    ApiErrors           = $injector.get('ApiErrors');

    $http               = $injector.get('$http');
    $httpBackend        = $injector.get('$httpBackend');

    apiURL              = $injector.get('appConfig').api.url;

    provideAuth($injector)();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Request', function() {
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
      $httpBackend.expectGET(apiURL + 'users', REQUEST_HEADERS).respond(200, '');
      $http.get('apis://users').success(function(/*data, status, headers*/) {
      });

      $httpBackend.flush();
    });
  });

  describe('Response', function() {

    var successCallback, errorCallback;

    beforeEach(function() {
      successCallback = jasmine.createSpy('success');
      errorCallback = jasmine.createSpy('error');
    });
    
    it('should do nothing if it\'s not an API request', function() {
      
      $httpBackend.expectGET('http://google.com').respond(200, 'OK');
      $http.get('http://google.com').then(successCallback, errorCallback);

      $httpBackend.flush();

      expect(successCallback.calls.count()).toEqual(1);
      expect(errorCallback.calls.any()).toEqual(false);

      expect(successCallback.calls.argsFor(0)[0].data).toEqual('OK');

    });

    describe('API requests (no auth)', function() {
      
      it('should return data property is success', function() {
      
        $httpBackend.expectGET(apiURL + 'users').respond(200, apiResponseAsString(null, 'test'));
        $http.get('api://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(successCallback.calls.count()).toEqual(1);
        expect(errorCallback.calls.any()).toEqual(false);

        expect(successCallback.calls.argsFor(0)[0].data).toEqual('test');

      });

      it('should return ApiErrors in error property', function() {
        $httpBackend.expectGET(apiURL + 'users').respond(401, apiResponseAsString(['api.not_authorized']));
        $http.get('api://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Api).toEqual(true);
      });

      it('should return ApiErrors in error property (special case)', function() {
        $httpBackend.expectGET(apiURL + 'users').respond(200, apiResponseAsString(['api.not_authorized']));
        $http.get('api://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Api).toEqual(true);

      });

      it('should return HttpError in error property', function() {
        $httpBackend.expectGET(apiURL + 'users').respond(401, '');
        $http.get('api://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Http).toEqual(true);

      });

    });

    describe('APIS requests (with auth)', function() {
      
      it('should return data property is success', function() {
        $httpBackend.expectGET(apiURL + 'users', REQUEST_HEADERS).respond(200, apiResponseAsString(null, 'test'));
        $http.get('apis://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(successCallback.calls.count()).toEqual(1);
        expect(errorCallback.calls.any()).toEqual(false);

        expect(successCallback.calls.argsFor(0)[0].data).toEqual('test');
      });

      it('should return ApiErrors in error property', function() {
        $httpBackend.expectGET(apiURL + 'users', REQUEST_HEADERS).respond(401, apiResponseAsString(['api.not_authorized']));
        $http.get('apis://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Api).toEqual(true);
      });

      it('should return ApiErrors in error property (special case)', function() {
        $httpBackend.expectGET(apiURL + 'users', REQUEST_HEADERS).respond(200, apiResponseAsString(['api.not_authorized']));
        $http.get('apis://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Api).toEqual(true);

      });

      it('should return HttpError in error property', function() {
        $httpBackend.expectGET(apiURL + 'users', REQUEST_HEADERS).respond(401, '');
        $http.get('apis://users').then(successCallback, errorCallback);

        $httpBackend.flush();

        expect(errorCallback.calls.count()).toEqual(1);
        expect(successCallback.calls.any()).toEqual(false);

        expect(errorCallback.calls.argsFor(0)[0].error instanceof ApiErrors.Http).toEqual(true);

      });

    });

  });

});
