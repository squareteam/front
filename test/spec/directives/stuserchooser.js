/* global $, apiURL, provideAuth, apiResponseAsString, updateIsolateScope */

'use strict';

describe('Directive: st-user-chooser', function () {

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stuserchooser.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }));

  var url,
     $httpBackend, $rootScope, $state, $compile,
     element, scope;

  beforeEach(inject(function ($injector) {

    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');
    $state          = $injector.get('$state');
    $compile        = $injector.get('$compile');

    url = apiURL($injector);

    // provide a valid auth for the test
    provideAuth($injector)();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('when doing a search', function() {

    beforeEach(function() {
      scope = $rootScope.$new();

      scope.referential = [];
      scope.differential = [];

      element = angular.element('<st-user-chooser referential="referential" differential="differential"></st-user-chooser>');
      element = $compile(element)(scope);

      $rootScope.$digest();

      $httpBackend.expectGET( url('users/search?q=test') ).respond(200, apiResponseAsString(null, [{id:1,name:'charly'}, {id:2,name:'paul'}]));

      updateIsolateScope(element, { search : 'test' });
    });

    describe('with no users selected', function() {

      it('should display users found', function() {

        $httpBackend.flush();

        $rootScope.$digest();

        expect(element.find('.results-list li').length).toBe(2);

      });

    });

    describe('with users selected', function() {

      beforeEach(function() {

        updateIsolateScope(element, { selectedUsers : [ { id:3, name:'yann'} ] });

      });

      it('should display users found and selected users', function() {

        $httpBackend.flush();

        $rootScope.$digest();

        expect(element.find('.results-list li').length).toBe(3);

      });

    });

  });

  describe('with referential', function() {

    beforeEach(function() {
      scope = $rootScope.$new();

      scope.referential = [
        {
          id : 1,
          name : 'charly'
        }
      ];
      scope.differential = [];

      element = angular.element('<st-user-chooser referential="referential" differential="differential"></st-user-chooser>');
      element = $compile(element)(scope);

      $rootScope.$digest();

    });

    it('should display selected users even by default', function() {

      expect(element.find('.results-list li').length).toBe(1);
      expect($.trim(element.find('.results-list li').text())).toBe('charly');

    });

    describe('when selecting users', function() {

      beforeEach(function() {

        updateIsolateScope(element, { selectedUsers : [ { id:3, name:'yann'}, { id:1, name:'charly'} ] });

      });

      it('differential should flag them as "added"', function() {

        $rootScope.$digest();

        expect(Object.keys(scope.differential.added).length).toBe(1);
        expect(scope.differential.added[0].name).toBe('yann');


      });

    });

    describe('when removing users', function() {

      beforeEach(function() {

        updateIsolateScope(element, { selectedUsers : [ ] });

      });

      it('differential should flag them as "deleted"', function() {

        $rootScope.$digest();

        expect(Object.keys(scope.differential.deleted).length).toBe(1);
        expect(scope.differential.deleted[0].name).toBe('charly');

      });

    });

  });

  describe('without referential', function() {

    beforeEach(function() {
      scope = $rootScope.$new();

      scope.referential = [];
      scope.differential = [];

      element = angular.element('<st-user-chooser referential="referential" differential="differential"></st-user-chooser>');
      element = $compile(element)(scope);

      $rootScope.$digest();

    });

    it('should display no users by default', function() {

      expect(element.find('.results-list li').length).toBe(0);

    });

  });

});
