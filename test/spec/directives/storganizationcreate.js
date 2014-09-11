/*global $, apiResponseAsString, provideAuth, apiURL */

'use strict';

describe('Directive: st-organization-create', function () {


  module(function($provide) {
    $provide.service('$location', function() {
      this.path = function() {};
    });
  });

  // load the directive's module
  beforeEach(module('scripts/directives/templates/storganizationcreate.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }));

  var url, ApiAuth,
      $httpBackend, $rootScope, $location,
      element, scope;

  beforeEach(inject(function ($compile, $injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $location       = $injector.get('$location');

    ApiAuth         = $injector.get('ApiAuth');

    url = apiURL($injector);

    provideAuth($injector)();

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('with no directive options', function() {
    
    beforeEach(inject(function($compile) {
      scope = $rootScope.$new();
      element = angular.element('<st-organization-create></st-organization-create>');
      element = $compile(element)(scope);

      $rootScope.$digest();

      scope.organization = {};
    }));

    it('should expose a `create` method', function() {
      expect(!!element.isolateScope().create).toBe(true);
    });

    describe('at initial state', function() {
      
      it('error divs must hidden', function() {
        expect(element.find('.alert').hasClass('ng-hide')).toBe(true);
      });

      it('name input should be empty', function() {
        expect(element.find('input[name="name"]').val()).toEqual('');
      });

    });
    
    it('should display alert if name taken', function() {
      $httpBackend.expectPOST( url('organizations/with_admins') ).respond(400, apiResponseAsString(['api.already_taken.Name']));

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        organization : {
          name : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().create();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect($(element.find('.alert')[0]).hasClass('ng-hide')).toBe(false);
      expect($(element.find('.alert')[0]).text().trim()).toBe('directives.stOrganizationCreate.nameTaken');

    });
        
    it('should display alert if server busy', function() {

      $httpBackend.expectPOST( url('organizations/with_admins') ).respond(500, '');

      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        organization : {
          name : 'test'
        }
      });
      element.data('$isolateScope', directiveScope);

      $rootScope.$digest();

      element.isolateScope().create();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();

      expect($(element.find('.alert')[1]).hasClass('ng-hide')).toBe(false);
      // expect($(element.find('.alert')[1]).text().trim()).toBe('Nos serveurs sont momentanément indisponibles.\n\nVeuillez réessayer dans quelques instants.');

    });


  });

  
});
