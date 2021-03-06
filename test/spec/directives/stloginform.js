'use strict';

/*global $*/


describe('Directive: st-login-form', function () {


  module(function($provide) {
    $provide.service('$state', function() {
      this.go = function() {};
    });
  });

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stoauthlink.html'));
  beforeEach(module('scripts/directives/templates/stloginform.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }));

  var appConfig,
      $httpBackend, $rootScope, $state,
      element, scope,
      alertLoginElt, alertPasswordElt, alertServerElt;

  beforeEach(inject(function ($compile, $injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $state          = $injector.get('$state');

    appConfig       = $injector.get('appConfig');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('with no directive options', function() {
    
    beforeEach(inject(function($compile) {
      scope = $rootScope.$new();
      element = angular.element('<st-login-form></st-login-form>');
      element = $compile(element)(scope);

      $rootScope.$digest();


      alertLoginElt     = $(element.find('.alert')[0]);
      alertPasswordElt  = $(element.find('.alert')[1]);
      alertServerElt    = $(element.find('.alert')[2]);

    }));


    it('should expose a `login` method', function() {
      expect(!!element.isolateScope().login).toBe(true);
    });

    describe('at initial state', function() {
      
      it('error divs must hidden', function() {
        expect(element.find('.alert').hasClass('ng-hide')).toBe(true);
      });

      it('inputs should be empty', function() {
        expect(element.find('input[type!="submit"]').val()).toEqual('');
      });

    });

    it('should display alert if login is incorrect', function() {
      $httpBackend.expectPUT(appConfig.api.url + 'login', '{"identifier":"charly@live.fr"}').respond(400, '{"data":null,"errors":["auth.bad_login"]}');

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        user : {
          email     : 'charly@live.fr',
          password  : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().login();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertLoginElt.hasClass('ng-hide')).toBe(false);
      expect(alertLoginElt.text().trim()).toBe('directives.stLoginForm.emailInvalid');

    });

    it('should display alert if password is incorrect', function() {
      $httpBackend.expectPUT(appConfig.api.url + 'login', '{"identifier":"charly@live.fr"}').respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(appConfig.api.url + 'user/me').respond(401, '{"data":null,"errors":["auth is not valid"]}');

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        user : {
          email     : 'charly@live.fr',
          password  : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().login();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertPasswordElt.hasClass('ng-hide')).toBe(false);
      expect(alertPasswordElt.text().trim()).toBe('directives.stLoginForm.passwordInvalid');

    });

    it('should display alert if API is down (password check)', function() {
      $httpBackend.expectPUT(appConfig.api.url + 'login', '{"identifier":"charly@live.fr"}').respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(appConfig.api.url + 'user/me').respond(500);

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        user : {
          email     : 'charly@live.fr',
          password  : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().login();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertServerElt.hasClass('ng-hide')).toBe(false);

    });

    it('should display alert if API is down (login check)', function() {
      $httpBackend.expectPUT(appConfig.api.url + 'login', '{"identifier":"charly@live.fr"}').respond(500);

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        user : {
          email     : 'charly@live.fr',
          password  : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().login();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertServerElt.hasClass('ng-hide')).toBe(false);

    });

    it('should login', function() {
      spyOn($state, 'go');

      $httpBackend.expectPUT(appConfig.api.url + 'login', '{"identifier":"charly@live.fr"}')  .respond(200, '{"data":{"salt1":"36b26d1ee22bb35e","salt2":"a5e28ef7bcb5605b"}}');
      $httpBackend.expectGET(appConfig.api.url + 'user/me').respond(200, '{"data":{"name":"Charly"}}');

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        user : {
          email     : 'charly@live.fr',
          password  : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().login();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect($state.go).toHaveBeenCalledWith('app.home');
      expect(element.find('.alert').hasClass('ng-hide')).toBe(true);

    });

  });

});