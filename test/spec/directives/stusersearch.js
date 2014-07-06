/* global $, provideAuth */

'use strict';

describe('Directive: stusersearch', function () {

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stusersearch.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }));

  var appConfig,
     $httpBackend, $rootScope, $state, $compile,
     element, scope;

  beforeEach(inject(function ($injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $state          = $injector.get('$state');
    $compile        = $injector.get('$compile');

    appConfig       = $injector.get('appConfig');

    // provide a valid auth for the test
    provideAuth($injector)();

    scope = $rootScope.$new();
    scope.userSelected = function() {};
    element = angular.element('<st-user-search on-select="userSelected"></st-user-search>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe('at initial state', function() {

    it('results list should be empty', function () {
      expect(element.find('.results li').length).toBe(0);
    });

  });

  describe('when perform a search', function() {

    beforeEach(function() {
      // Update directive scope
      var directiveScope = element.isolateScope();
      directiveScope = angular.extend(directiveScope, {
        query : 'test'
      });
      element.data('$isolateScope', directiveScope);
    });

    it('should display results if any', function() {

      $httpBackend.expectGET(appConfig.api.url + 'user/search?query=test').respond(200, '{"errors":null,"data":[{"id":1,"name":"charly","email":"cpoly55@gmail.com"}]}');

      element.isolateScope().search();

      $httpBackend.flush();

      $rootScope.$digest();

      expect(element.find('.results li').length).toBe(1);
    });

    it('should display a message if no results', function() {

      $httpBackend.expectGET(appConfig.api.url + 'user/search?query=test').respond(200, '{"errors":null,"data":[]}');

      element.isolateScope().search();

      $httpBackend.flush();

      $rootScope.$digest();

      expect(element.find('.results li').length).toBe(1);
      expect($.trim(element.find('.results li').text())).toBe('directives.stUserSearch.noResults');
    });

    // TODO ?
    xdescribe('when select a result', function() {
      
      it('should call on-select function', function() {
        
        spyOn(scope, 'userSelected');

        expect(scope.userSelected).toHaveBeenCalledWith({
          id    : 1,
          name  : 'charly',
          email : 'cpoly55@gmail.com'
        });

      });

    });


  });

});
