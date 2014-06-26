'use strict';
/*global $, CryptoJS*/
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

  var appConfig, ApiAuth,
      $httpBackend, $rootScope, $location,
      element, scope;

  beforeEach(inject(function ($compile, $injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $location       = $injector.get('$location');

    appConfig       = $injector.get('appConfig');
    ApiAuth         = $injector.get('ApiAuth');

    $injector.get('CurrentSession').$$user = { id : 1, name : 'charly', email : 'charly.poly@live.fr'};
    $injector.get('CurrentSession').$$auth = new ApiAuth('charly', CryptoJS.enc.Hex.parse('a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1'));

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
      $httpBackend.expectPOST(appConfig.api.url + 'organizations').respond(400, '{"data":null,"errors":["Name has already been taken"]}');

      scope.organization.name = 'test';

      $rootScope.$digest();

      element.isolateScope().create();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();


      expect($(element.find('.alert')[0]).hasClass('ng-hide')).toBe(false);
      expect($(element.find('.alert')[0]).text().trim()).toBe('directives.stOrganizationCreate.nameTaken');

    });
        
    it('should display alert if server busy', function() {

      $httpBackend.expectPOST(appConfig.api.url + 'organizations').respond(500, '');

      scope.organization.name = 'test';

      $rootScope.$digest();

      element.isolateScope().create();

      $rootScope.$digest();

      $httpBackend.flush();

      $rootScope.$digest();

      expect($(element.find('.alert')[1]).hasClass('ng-hide')).toBe(false);
      // expect($(element.find('.alert')[1]).text().trim()).toBe('Nos serveurs sont momentanément indisponibles.\n\nVeuillez réessayer dans quelques instants.');

    });

    // it('should save organization and redirect to `/home`', function() {

    //   spyOn($location, 'path');

    //   $httpBackend.expectPOST(appConfig.api.url + 'organizations').respond(201, '{"data": {"id":1,"name":"test","members":[]},"errors":null');

    //   scope.organization.name = 'test';

    //   $rootScope.$digest();

    //   element.isolateScope().create();

    //   $rootScope.$digest();

    //   $httpBackend.flush();

    //   $rootScope.$digest();


    //   expect($location.path).toHaveBeenCalledWith('/home');

    //   expect(element.find('.alert').hasClass('ng-hide')).toBe(true);

    // });


  });



  // describe('with for-users directive options', function() {
      
  //   beforeEach(inject(function($compile) {
  //     scope = $rootScope.$new();

  //     scope.userIds = [1];

  //     element = angular.element('<st-organization-create for-users="userIds"></st-organization-create>');
  //     element = $compile(element)(scope);

  //     $rootScope.$digest();

  //     scope.organization = {};
  //   }));

  //   it('should save organization but fail to add members (500)', function() {

  //     $httpBackend.expectPOST(appConfig.api.url + 'organizations').respond(201, '{"data": {"id":1,"name":"test","members":[]},"errors":null');
  //     $httpBackend.expectPOST(appConfig.api.url + 'members').respond(500, '');

  //     scope.organization.name = 'test';

  //     $rootScope.$digest();

  //     element.isolateScope().create();

  //     $rootScope.$digest();

  //     $httpBackend.flush();

  //     $rootScope.$digest();


  //     expect($(element.find('.alert')[1]).hasClass('ng-hide')).toBe(false);

  //   });

  //   it('should save organization, add members and redirect to `/home`', function() {

  //     spyOn($location, 'path');

  //     $httpBackend.expectPOST(appConfig.api.url + 'organizations').respond(201, '{"data":{"id":1,"name":"tester","members":[]},"errors":""}');
  //     $httpBackend.expectPOST(appConfig.api.url + 'members', 'organization_id=1&user_id=1&admin=1').respond(201, '{"data": {"id":1,"organization_id":1,"user_id":1},"errors":null}');

  //     scope.organization.name = 'test';

  //     $rootScope.$digest();

  //     element.isolateScope().create();

  //     $rootScope.$digest();

  //     $httpBackend.flush();

  //     $rootScope.$digest();


  //     expect($location.path).toHaveBeenCalledWith('/home');

  //     expect(element.find('.alert').hasClass('ng-hide')).toBe(true);

  //   });
    
  // });

  
});
