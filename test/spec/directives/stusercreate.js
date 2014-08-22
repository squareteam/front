'use strict';

/* global $, apiResponseAsString*/


describe('Directive: st-user-create', function () {


  module(function($provide) {
    $provide.service('$location', function() {
      this.path = function() {};
    });
  });

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stoauthlink.html'));
  beforeEach(module('scripts/directives/templates/stusercreate.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }));

  var appConfig,
      $httpBackend, $rootScope, $location,
      element, scope,
      alertEmailTakenElt, alertServerElt;

  beforeEach(inject(function ($compile, $injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $location       = $injector.get('$location');

    appConfig       = $injector.get('appConfig');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('with no directive options', function() {
    
    beforeEach(inject(function($compile) {
      scope = $rootScope.$new();
      element = angular.element('<st-user-create></st-user-create>');
      element = $compile(element)(scope);

      $rootScope.$digest();


      alertEmailTakenElt  = $(element.find('.alert')[0]);
      alertServerElt      = $(element.find('.alert')[1]);

    }));


    it('should expose a `register` method', function() {
      expect(!!scope.register).toBe(true);
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
      $httpBackend.expectPOST(appConfig.api.url + 'users', '{"name":"charly","email":"charly@live.fr","password":"test"}').respond(400, apiResponseAsString(['api.already_taken.Email']));


      scope.user = {
        login         : 'charly',
        email         : 'charly@live.fr',
        password      : 'test',
        'cgu_accept'  : true
      };


      $rootScope.$digest();

      scope.register();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertEmailTakenElt.hasClass('ng-hide')).toBe(false);
      expect(alertEmailTakenElt.text().trim()).toBe('directives.stUserCreate.emailTaken');

    });

    it('should display alert cause API is down', function() {
      $httpBackend.expectPOST(appConfig.api.url + 'users', '{"name":"charly","email":"charly@live.fr","password":"test"}').respond(500);


      scope.user = {
        login         : 'charly',
        email         : 'charly@live.fr',
        password      : 'test',
        'cgu_accept'  : true
      };


      $rootScope.$digest();

      scope.register();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect(alertServerElt.hasClass('ng-hide')).toBe(false);

    });

    it('should display a notice if password is not secure', function() {

      scope.user = {
        login         : 'charly',
        email         : 'charly@live.fr',
        password      : 'test', // BAD PASSWORD
        'cgu_accept'  : true
      };

      // force it since `passwordNoticeDiv` shows when password input is dirty
      scope.registerForm.password.$dirty = true;

      $rootScope.$digest();
      scope.passwordFormat();
      $rootScope.$digest();

      var passwordNoticeDiv = $($(element).find('input[name="password"]').nextAll('div')[0]);
      expect(passwordNoticeDiv.text().trim()).toBe('directives.stUserCreate.passwordFormatHelp');
      expect(passwordNoticeDiv.hasClass('ng-hide')).toBe(false);

    });

    it('should register', function() {
      spyOn($location, 'path');

      $httpBackend.expectPOST(appConfig.api.url + 'users', '{"name":"charly","email":"charly@live.fr","password":"test"}').respond(201, apiResponseAsString(null, {'salt1':'36b26d1ee22bb35e','salt2':'a5e28ef7bcb5605b'}));
      $httpBackend.expectGET(appConfig.api.url + 'users/me').respond(200, apiResponseAsString(null, {'id':1}));

      scope.user = {
        login         : 'charly',
        email         : 'charly@live.fr',
        password      : 'test',
        'cgu_accept'  : true
      };

      $rootScope.$digest();

      scope.register();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect($location.path).toHaveBeenCalledWith('/home');
      expect(element.find('.alert').hasClass('ng-hide')).toBe(true);

    });

  });

});
