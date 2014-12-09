'use strict';

describe('ApiOAuth', function() {

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

  var ApiOAuth, ApiSession, appConfig,
      $location, $rootScope, $cookies;

  beforeEach(inject(function($injector) {
    ApiOAuth    = $injector.get('ApiOAuth');
    ApiSession  = $injector.get('ApiSession');
    appConfig   = $injector.get('appConfig');

    $location   = $injector.get('$location');
    $cookies    = $injector.get('$cookies');
    $rootScope  = $injector.get('$rootScope');
  }));

  describe('Helpers', function() {

    describe('when `?provider=xxx&email=yyy` and oauth cookies', function() {

      beforeEach(function() {

        spyOn($location, 'search').and.returnValue({
          provider : 'github',
          email    : 'charly@squareteam.io'
        });

        $cookies[appConfig.api.oauth.cookieNS] = 'key';

      });

      it('isOAuthLoginRequest() should return true', function() {

        expect(ApiOAuth.isOAuthLoginRequest()).toBeTruthy();

      });

      it('oAuthLoginData() should return data', function() {

        expect(ApiOAuth.oAuthLoginData()).toEqual({
          provider : 'github',
          email    : 'charly@squareteam.io',
          tmpKey   : 'key'
        });

      });

      it('redirectIfLogin() should redirect to `/oauth/check`', function() {

        spyOn($location, 'path');

        ApiOAuth.redirectIfLogin();

        expect($location.path).toHaveBeenCalledWith('/oauth/check');

      });

      afterEach(function() {
        delete $cookies[appConfig.api.oauth.cookieNS];
      });

    });

    describe('when `?errors[email][]=api.missing_attribute&provider=github`', function() {

      beforeEach(function() {

        spyOn($location, 'search').and.returnValue({
          'errors[email][]' : 'api.missing_attribute',
          provider        : 'github'
        });

        $cookies[appConfig.api.oauth.cookieNS] = 'key';

      });

      it('isOAuthEmailMissingRequest() should return true', function() {

        $rootScope.$digest();

        expect(ApiOAuth.isOAuthEmailMissingRequest()).toBeTruthy();

      });

      it('redirectIfEmailConfirmation() should redirect to `/oauth/email` if OAuth email confirm params', function() {
        spyOn($location, 'path');

        ApiOAuth.redirectIfEmailConfirmation();

        expect($location.path).toHaveBeenCalledWith('/oauth/email');

      });


    });

    describe('when no search params', function() {

      it('isOAuthLoginRequest() should return false', function() {

        expect(ApiOAuth.isOAuthLoginRequest()).toBeFalsy();

      });

      it('isOAuthLoginRequest() should return false', function() {

        expect(ApiOAuth.isOAuthLoginRequest()).toBeFalsy();

      });

    });

  });

  // TODO(charly): test error case...

  describe('login()', function() {

    beforeEach(function() {

      spyOn(ApiOAuth, 'isOAuthLoginRequest').and.returnValue(true);
      spyOn(ApiOAuth, 'oAuthLoginData').and.returnValue({
        email   : 'charly@squareteam.io',
        tmpKey  : 'key'
      });

      spyOn(ApiSession, 'login').and.returnValue({
        then : function() {}
      });

    });

    it('should call ApiSession.login', function() {

      ApiOAuth.login();

      expect(ApiSession.login).toHaveBeenCalledWith('charly@squareteam.io', 'key');

    });

  });


});
