/* global $ */

'use strict';

// TODO(charly): test `placeholder` feature

describe('Directive: st-filter-dropdown', function () {

  // Override config for test
  beforeEach(module('scripts/directives/templates/stfilterdropdown.html'));
  beforeEach(module('squareteam.app'));

  function compileDirective (scope) {
    return $compile('<div ng-model="filter" st-filter-dropdown="items"></div>')(scope);
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
          label : 'test 1',
          value : '1',
          color : 'rgb(200, 200, 200)'
        },
        {
          label : 'test 2',
          value : '2',
          color : 'rgb(204, 204, 204)'
        },
        {
          label : 'test 3',
          value : '3',
          color : 'rgb(203, 203, 203)'
        }
      ];

      scope.filter = '';

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

        element.isolateScope().selectById(1);

        scope.$digest();

        expect(scope.filter).toBe('2');

        expect(element.isolateScope().selected.label).toBe('test 2');
        expect(element.isolateScope().selected.value).toBe('2');

      });

    });

    describe('when changing ngModel value', function() {

      it('should update element', function() {
        scope.filter = '2';

        $rootScope.$digest();

        expect(element.isolateScope().selected.label).toBe('test 2');
        expect(element.isolateScope().selected.value).toBe('2');
      });

    });

    describe('when selecting an item', function() {

      it('should change element bgColor', function() {

        scope.filter = '2';

        $rootScope.$digest();

        expect(element.css('backgroundColor')).toBe('rgb(204, 204, 204)');

      });

    });

  });

  describe('when using `dropdownClasses` attribute', function() {

    beforeEach(function() {

      scope.items = [
        {
          label : 'test 1',
          value : '1'
        },
        {
          label : 'test 2',
          value : '2'
        },
        {
          label : 'test 3',
          value : '3'
        }
      ];

      scope.filter = '';

      element = $compile('<div ng-model="filter" st-filter-dropdown="items" dropdown-classes="test-class"></div>')(scope);

      $rootScope.$digest();

    });

    it('should add given classes to dropdown', function() {
      expect(element.find('.dropdown_menu').first().hasClass('test-class')).toBe(true);
    });

  });


});