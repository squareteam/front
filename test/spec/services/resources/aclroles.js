'use strict';

describe('Service: AclRoles', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var AclRoles;
  beforeEach(inject(function ($injector) {
    AclRoles     = $injector.get('AclRoles');
  }));


  describe('roles operations', function() {

    it('should properly add permissions', function() {
      expect(AclRoles.add(0, 255)).toBe(255);
    });

    it('should return true if "has permissions"', function() {
      expect(AclRoles.has(255, 2)).toBe(true);
    });

    it('should properly remove permissions', function() {
      expect(AclRoles.remove(255, 2)).toBe(253);
    });

  });

});