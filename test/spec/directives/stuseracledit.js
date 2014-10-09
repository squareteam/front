/* globals updateIsolateScope */

'use strict';

describe('Directive: st-user-acl-edit', function () {

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stcheckbox.html'));
  beforeEach(module('scripts/directives/templates/stuseracledit.html'));
  beforeEach(module('squareteam.app', function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }));



  var $rootScope, $compile,
      element, scope;

  beforeEach(inject(function ($injector) {

    $rootScope      = $injector.get('$rootScope');
    $compile        = $injector.get('$compile');

    scope = $rootScope.$new();

    scope.user = {
      id : 1,
      name : 'charly',
      permissions : 255
    };

    element = angular.element('<st-user-acl-edit user="user"></st-user-acl-edit>');

    element = $compile(element)(scope);

    $rootScope.$digest();
  }));


  describe('when updating scope.user', function() {

    it('directiveScope.roleToAdd should be updated', function() {

      expect(element.isolateScope().roleToAdd).toBe(255);

    });

  });

  describe('when updating directiveScope.roleToAdd', function() {


    // TODO(charly): fix this test...
    xit('should update scope.user', function() {

      updateIsolateScope(element, {
        roleToAdd : 2
      });

      $rootScope.$digest();

      expect(scope.user.permissions).toBe(2);

    });

  });

});
