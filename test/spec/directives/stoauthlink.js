'use strict';

describe('Directive: st-oauth-link', function () {

  // Override config for test
  beforeEach(module('scripts/directives/templates/stoauthlink.html'));
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

  var element, scope,
      $log, $compile, $rootScope, appConfig;

  beforeEach(inject(function($injector) {
    $log        = $injector.get('$log');
    $compile    = $injector.get('$compile');
    $rootScope  = $injector.get('$rootScope');
    appConfig   = $injector.get('appConfig');
  }));

  describe('with an unknown oauth service', function() {
    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
      element = angular.element('<st-oauth-link service="google" mode="signin"></st-oauth-link>');
    }));
    
    it('should log an error message', function() {
      spyOn($log, 'error');

      element = $compile(element)(scope);
      $rootScope.$digest();

      expect($log.error).toHaveBeenCalledWith('no configuration for oauth service : google');
    });
  });

  describe('with Github oauth service', function() {

    describe('signup mode', function() {

      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        element = angular.element('<st-oauth-link service="github" mode="signup"></st-oauth-link>');
        $compile(element)(scope);
        $rootScope.$digest();
      }));
      
      it('should display correct service name');

      xit('should display correct action name', function() {
        expect(element.find('span').text()).toBe('directives.stOAuthLink.signUp');
      });

      it('should set correct service endpoint', function() {
        expect(element.find('a').attr('href')).toBe(appConfig.api.oauth.github.endpoint);
      });

      it('should display correct service icon', function() {
        expect(element.find('img').attr('src')).toBe('../images/' + appConfig.api.oauth.github.iconPath);
      });

    });

    describe('signin mode', function() {
      
      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        element = angular.element('<st-oauth-link service="github" mode="signin"></st-oauth-link>');
        $compile(element)(scope);
        $rootScope.$digest();
      }));

      it('should display correct service name');

      xit('should display correct action name', function() {
        expect(element.find('span').text()).toBe('directives.stOAuthLink.signIn');
      });

      it('should set correct service endpoint', function() {
        expect(element.find('a').attr('href')).toBe(appConfig.api.oauth.github.endpoint);
      });

      it('should display correct service icon', function() {
        expect(element.find('img').attr('src')).toBe('../images/' + appConfig.api.oauth.github.iconPath);
      });

    });


  });

});
