'use strict';

describe('Controller: OAuthLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app', function($provide) {
    $provide.factory('appConfig', function () {
      var api = {
        host      : 'http://localhost:8000',
        path      : '/api/',
        storageNS : 'st.session'
      };

      api.url             = api.host + api.path;
      api.oauth = {
        cookieNS  : 'st.oauth'
      };

      api.oauth.github = {
        endpoint  : api.url + 'auth/github',
        iconPath  : 'logo_github.png',
        name      : 'Github'
      };


      return {
        api : api
      };
    });
  }));

  var OAuthLoginCtrl, ApiOAuth, stUtils,
      $rootScope, $state, $controller, $location, $q,
      scope, resolvePromise;

  resolvePromise = function() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $rootScope  = $injector.get('$rootScope');
    $state      = $injector.get('$state');
    $controller = $injector.get('$controller');
    $location   = $injector.get('$location');
    $q          = $injector.get('$q');

    ApiOAuth    = $injector.get('ApiOAuth');
    stUtils     = $injector.get('stUtils');

    scope = $rootScope.$new();
  }));

  describe('if oauth params missing', function() {

    beforeEach(function() {
      spyOn($state, 'go');
      spyOn(ApiOAuth, 'isOAuthLoginRequest').and.returnValue(false);
    });

    it('should redirect to login', function () {

      OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
        $scope: scope
      });

      expect($state.go).toHaveBeenCalledWith('public.login');

    });

    it('scope.authenticating should be false', function() {

      OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
        $scope: scope
      });

      expect(scope.authenticating).toBe(false);
    });

  });


  describe('when login', function() {

    beforeEach(function() {

      spyOn($state, 'go');

      spyOn(ApiOAuth, 'oAuthLoginData').and.returnValue({
        email : 'charly@squareteam.io'
      });

      spyOn(ApiOAuth, 'isOAuthLoginRequest').and.returnValue(true);

    });

    it('scope.authenticating should be true', function() {

      spyOn(ApiOAuth, 'login').and.returnValue($q.reject());

      OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
        $scope: scope
      });

      expect(scope.authenticating).toBe(true);
    });

    it('scope.login should be user email', function() {

      spyOn(ApiOAuth, 'login').and.returnValue($q.reject());

      OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
        $scope: scope
      });

      expect(scope.login).toBe('charly@squareteam.io');
    });

    describe('if success', function() {

      beforeEach(function() {
        spyOn(ApiOAuth, 'login').and.returnValue(resolvePromise());
      });

      it('should redirect to `app.home`', function() {

        OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
          $scope: scope
        });

        $rootScope.$digest();

        expect($state.go).toHaveBeenCalledWith('app.home');

      });

    });

    describe('if error', function() {

      beforeEach(function() {
        spyOn(ApiOAuth, 'login').and.returnValue($q.reject());
      });

      it('should display error message', function() {
        OAuthLoginCtrl = $controller('OAuthLoginCtrl', {
          $scope: scope
        });

        $rootScope.$digest();

        expect(scope.error).toBeTruthy();
      });

    });

  });

});
