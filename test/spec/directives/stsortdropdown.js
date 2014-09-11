/* global $ */

'use strict';

// TODO(charly): test `placeholder` feature

describe('Directive: st-sort-dropdown', function () {

  // Override config for test
  beforeEach(module('scripts/directives/templates/stsortdropdown.html'));
  beforeEach(module('squareteam.app'));

  function compileDirective (scope) {
    return $compile('<div ng-model="sort" st-sort-dropdown="items"></div>')(scope);
  }

  var element, scope,
      $compile, $rootScope;

  beforeEach(inject(function($injector) {
    $compile    = $injector.get('$compile');
    $rootScope  = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));


  describe('given a item list', function() {

    beforeEach(function() {

      scope.items = [
        {
          label : 'Name (ASC)',
          value : 'name',
          dir : 'asc'
        },
        {
          label : 'Name (DESC)',
          value : '-name',
          dir : 'desc'
        }
      ];

      scope.sort = '';

      element = compileDirective(scope);

      $rootScope.$digest();

    });

    it('should display them in the dropdown list', function() {
      var lis = element.find('.dropdown_menu li');

      angular.forEach(scope.items, function(item, index) {

        expect($.trim($(lis.get(index)).text())).toBe(item.label);

      });
    });

    describe('when selecting a element from the DOM', function() {

      it('should update ngModel and element', function() {

        var directiveScope = element.isolateScope();
        directiveScope = angular.extend(directiveScope, {
          selectedIndex : 1
        });
        element.data('$isolateScope', directiveScope);

        scope.$digest();

        expect(scope.sort).toBe('-name');

        expect(element.isolateScope().selected.label).toBe('Name (DESC)');
        expect(element.isolateScope().selected.value).toBe('-name');

      });

    });

    describe('when changing ngModel value', function() {

      it('should update element', function() {
        scope.sort = '-name';

        $rootScope.$digest();

        expect(element.isolateScope().selected.label).toBe('Name (DESC)');
        expect(element.isolateScope().selected.value).toBe('-name');
      });

    });

    describe('when selecting an item', function() {

      it('should add "icon-sort-asc" class if item.dir="asc" ', function() {

        scope.sort = 'name';

        $rootScope.$digest();

        expect(element.hasClass('icon-sort-asc')).toBe(true);
        expect(element.hasClass('icon-sort-desc')).toBe(false);

      });

      it('should add "icon-sort-desc" class if item.dir="desc" ', function() {

        scope.sort = '-name';

        $rootScope.$digest();

        expect(element.hasClass('icon-sort-asc')).toBe(false);
        expect(element.hasClass('icon-sort-desc')).toBe(true);

      });

    });

  });

  describe('when using `dropdownClasses` attribute', function() {

    beforeEach(function() {

      scope.items = [
        {
          label : 'Name (ASC)',
          value : 'name',
          dir : 'asc'
        },
        {
          label : 'Name (DESC)',
          value : '-name',
          dir : 'desc'
        }
      ];

      scope.sort = '';

      element = $compile('<div ng-model="sort" st-sort-dropdown="items" dropdown-classes="test-class"></div>')(scope);

      $rootScope.$digest();

    });

    it('should add given classes to dropdown', function() {
      expect(element.find('.dropdown_menu').first().hasClass('test-class')).toBe(true);
    });

  });


});