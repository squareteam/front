'use strict';

describe('Controller: ApplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app'));

  var ApplicationCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationCtrl = $controller('ApplicationCtrl', {
      $scope: scope
    });
  }));

  it('should attach ApiSession as session to the scope', function () {
    expect(!!scope.session).toBe(true);
  });
});
