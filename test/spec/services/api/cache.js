/* global apiURL */

'use strict';

describe('Service: ApiCache', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var ApiCache, appConfig, url;

  beforeEach(inject(function ($injector) {
    ApiCache = $injector.get('ApiCache');
    appConfig = $injector.get('appConfig');

    url = apiURL($injector);
  }));


  it('should store request as given', function() {
    ApiCache.put(url('project/1'), { id : 1 , name : 'test'});

    expect(ApiCache.get(url('project/1'))).toEqual({ id : 1 , name : 'test'});
  });

  it('should store request as given and split if collection', function() {
    ApiCache.put(url('projects'), [
      { id : 1 , name : 'test'},
      { id : 2 , name : 'tester'},
      { id : 3 , name : 'testeeeer'}
    ]);

    expect(ApiCache.get(url('projects'))).toEqual([
      { id : 1 , name : 'test'},
      { id : 2 , name : 'tester'},
      { id : 3 , name : 'testeeeer'}
    ]);

    expect(ApiCache.get(url('project/1'))).toEqual({ id : 1 , name : 'test'});
    expect(ApiCache.get(url('project/2'))).toEqual({ id : 2 , name : 'tester'});
    expect(ApiCache.get(url('project/3'))).toEqual({ id : 3 , name : 'testeeeer'});
  });

  describe('removing data from cache', function() {

    it('should remove request data', function() {
      ApiCache.put(url('project/1'), { id : 1 , name : 'test'});

      ApiCache.remove(url('project/1'));

      expect(ApiCache.get(url('project/1'))).toBeUndefined();
    });

    it('should remove request associated data', function() {

      ApiCache.put(url('projects'), [
        { id : 1 , name : 'test'},
        { id : 2 , name : 'tester'},
        { id : 3 , name : 'testeeeer'}
      ]);

      ApiCache.remove(url('projects'));

      expect(ApiCache.get(url('projects'))).toBeUndefined();

      expect(ApiCache.get(url('project/1'))).toBeUndefined();
      expect(ApiCache.get(url('project/2'))).toBeUndefined();
      expect(ApiCache.get(url('project/3'))).toBeUndefined();

    });

  });


  afterEach(function() {
    ApiCache.removeAll();
  });

});