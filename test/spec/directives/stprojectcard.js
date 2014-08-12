'use strict';

xdescribe('Directive: stprojectcard', function () {

  // load the directive's module
  beforeEach(module('squareteamApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stprojectcard></stprojectcard>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stprojectcard directive');
  }));
});
