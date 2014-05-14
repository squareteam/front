'use strict';

describe('Service: ApiErrors', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiErrors;
  beforeEach(inject(function ($injector) {
    ApiErrors = $injector.get('ApiErrors');
  }));

  describe('ApiErrors.Api', function() {
    
    it('.getErrors() should return errors', function () {
      var error = new ApiErrors.Api([
        'user.name should be filled',
        'user.password should be filled'
      ]);

      expect(error.getErrors()).toEqual([
        'user.name should be filled',
        'user.password should be filled'
      ]);

      expect(error.toString()).toEqual('ApiError : user.name should be filled, user.password should be filled');
    });

  });

  describe('ApiErrors.Http', function() {
    
    it('.toString() should print status and response text', function () {
      var error = new ApiErrors.Http(403, 'Forbidden');

      expect(error.toString()).toEqual('HttpError(403): Forbidden');

    });

  });

});
