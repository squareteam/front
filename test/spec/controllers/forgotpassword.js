'use strict';

describe('Controller: forgotPasswordCtrl', function () {

  beforeEach(module('squareteam.app'));

  var forgotPasswordCtrl,
      $rootScope, $httpBackend, $state,
      appConfig,
      scope;

  describe('without token in URL', function() {

    beforeEach(inject(function ($controller, $injector) {

      $rootScope      = $injector.get('$rootScope');
      $httpBackend    = $injector.get('$httpBackend');
      $state          = $injector.get('$state');
      
      appConfig       = $injector.get('appConfig');

      scope = $rootScope.$new();
      forgotPasswordCtrl = $controller('forgotPasswordCtrl', {
        $scope: scope
      });

      scope.user = {
        email : 'cpoly55@gmail.com'
      };

    }));

    it('should expose a request() method', function() {
      expect(typeof scope.request).toBe('function');
    });

    it('should call API when calling request()', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password').respond(200, '');

      scope.request();

      $httpBackend.flush();

      expect($state.go).toHaveBeenCalledWith('public.forgotPassword.request_sent');

    });

    it('should set scope.emailInvalid if API return 404', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password').respond(404, '');

      scope.request();

      $httpBackend.flush();

      expect(scope.emailInvalid).toBe(true);

    });

    it('should set scope.serverBusy if API return 500', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password').respond(500, '');

      scope.request();

      $httpBackend.flush();

      expect(scope.serverBusy).toBe(true);

    });

    describe('when oAuth account recognized', function() {
      beforeEach(function() {
        $httpBackend.expectPOST(appConfig.api.url + 'forgot_password').respond(400, '["api.oauth_account", {"provider": "github"}]');
      });

      it('should set scope.oAuthAccountFound as provider name', function() {

        scope.request();

        $httpBackend.flush();

        expect(scope.oAuthAccountFound).toBe('github');

      });

      it('should set scope.oAuthLoginLink as provider login endpoint', function() {

        scope.request();

        $httpBackend.flush();

        expect(scope.oAuthLoginLink).toBe(appConfig.api.oauth.github.endpoint);

      });
    });

  });

  describe('with token URL', function() {

    beforeEach(inject(function ($controller, $injector) {

      $rootScope      = $injector.get('$rootScope');
      $httpBackend    = $injector.get('$httpBackend');
      $state          = $injector.get('$state');
      
      appConfig       = $injector.get('appConfig');

      scope = $rootScope.$new();
      forgotPasswordCtrl = $controller('forgotPasswordCtrl', {
        $scope: scope,
        $stateParams : {
          token : '1234'
        }
      });

      scope.user = {
        email : 'cpoly55@gmail.com'
      };

    }));

    it('should expose a change() method', function() {
      expect(typeof scope.change).toBe('function');
    });

    it('should call API when calling change()', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password/change').respond(200, '');

      scope.change();

      $httpBackend.flush();

      expect($state.go).toHaveBeenCalledWith('public.forgotPassword.changed');

    });

    it('should set scope.tokenInvalid if API return 404', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password/change').respond(404, '');

      scope.change();

      $httpBackend.flush();

      expect(scope.tokenInvalid).toBe(true);

    });

    it('should set scope.serverBusy if API return 500', function() {

      spyOn($state, 'go');
      
      $httpBackend.expectPOST(appConfig.api.url + 'forgot_password/change').respond(500, '');

      scope.change();

      $httpBackend.flush();

      expect(scope.serverBusy).toBe(true);

    });

  });


});
