'use strict';

/*global $*/


describe('Directive: st-user-create', function () {


  module(function($provide) {
    $provide.service('$location', function() {
      this.path = function() {};
    });
  });

  // load the directive's module
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
      $httpBackend.expectPOST(appConfig.api.url + 'user', 'name=charly&email=charly%40live.fr&password=test').respond(400, '{"data":null,"errors":["Email has already been taken"]}');


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
      expect(alertEmailTakenElt.text().trim()).toBe('Cet email est déjà pris');

    });

    it('should display alert cause API is down', function() {
      $httpBackend.expectPOST(appConfig.api.url + 'user', 'name=charly&email=charly%40live.fr&password=test').respond(500);


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

    it('should register', function() {
      spyOn($location, 'path');

      $httpBackend.expectPOST(appConfig.api.url + 'user', 'name=charly&email=charly%40live.fr&password=test').respond(201, '{"data":{"id":1},"errors":null}');

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


      expect($location.path).toHaveBeenCalledWith('/login');
      expect(element.find('.alert').hasClass('ng-hide')).toBe(true);

    });

  });

});