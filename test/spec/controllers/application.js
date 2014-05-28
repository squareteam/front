'use strict';

describe('Controller: ApplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app', function($provide) {
    $provide.service('ApiSession', function() {
      this.logout = function() {};
    });

    $provide.service('$state', function() {
      this.go = function() {};
    });
  }));

  var ApplicationCtrl, ApiSession,
      $state, $q, $rootScope,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $injector) {

    $state      =  $injector.get('$state');
    $rootScope  =  $injector.get('$rootScope');
    $q          =  $injector.get('$q');

    ApiSession  =  $injector.get('ApiSession');

    scope = $rootScope.$new();
    ApplicationCtrl = $controller('ApplicationCtrl', {
      $scope: scope
    });
  }));

  it('should expose ApiSession as "session"', function () {
    expect(!!scope.session).toBe(true);
  });

  it('should expose Squareteam version as "version"', function () {
    expect(!!scope.version).toBe(true);
  });
  
  it('should expose CurrentSession as "currentSession"', function () {
    expect(!!scope.currentSession).toBe(true);
  });

  it('should expose logout method', function() {
    expect(!!scope.logout).toBe(true);
    expect(typeof scope.logout).toBe('function');
  });

  describe(' when perform logout ', function() {

    it('should redirect to login if succeed', function() {
      var deferred = $q.defer();
      deferred.resolve();
      spyOn(ApiSession, 'logout').and.returnValue(deferred.promise);
      spyOn($state, 'go');

      scope.logout();

      $rootScope.$digest();

      expect($state.go).toHaveBeenCalledWith('login');
    });

    it('should redirect to home if failed', function() {
      spyOn(ApiSession, 'logout').and.returnValue($q.reject('auth.invalid'));
      spyOn($state, 'go');

      scope.logout();

      $rootScope.$digest();

      expect($state.go).toHaveBeenCalledWith('app.home');
    });

  });

});
