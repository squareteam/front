/* global provideAuth, apiURL */

'use strict';

describe('Controller: ProjectsListCtrl', function () {

  beforeEach(module('views/app/projects/create_project_popin.html'));
  beforeEach(module('squareteam.app'));

  var ProjectsListCtrl, scope, resolvePromise, url,
      PasswordConfirmPopin, CurrentSession, ApiSession, UserResource, OrganizationResource,
      $httpBackend, $controller, $q, ngDialog;

  resolvePromise = function() {
    var deferred = $q.defer();
    deferred.resolve();
    return deferred.promise;
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $injector) {
    $httpBackend          = $injector.get('$httpBackend');
    $controller           = $injector.get('$controller');
    $q                    = $injector.get('$q');
    ngDialog              = $injector.get('ngDialog');

    PasswordConfirmPopin  = $injector.get('PasswordConfirmPopin');
    CurrentSession        = $injector.get('CurrentSession');
    ApiSession            = $injector.get('ApiSession');
    UserResource          = $injector.get('UserResource');
    OrganizationResource  = $injector.get('OrganizationResource');

    url = apiURL($injector);

    provideAuth($injector)();

    scope = $rootScope.$new();

  }));


  describe('should load projects', function() {

    it('from User if CurrentSession.getOrganizations() is empty', function() {

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
      });

      $httpBackend.expectGET( url('users/1/projects') ).respond(200, '{"data":[{"id":1,"name":"test","description":"test test"}]}');

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      scope.$digest();

      $httpBackend.flush();


      expect(scope.currentScope.id).toEqual(1);
      expect(scope.currentScope.name).toEqual('test-auth');
      expect(scope.currentScope.email).toEqual('charly.poly@live.fr');

      expect(scope.projects.length).toBe(1);

    });

    it('from User first Organization if no $scope.currentScope', function() {

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          OrganizationResource.$buildRaw({
            id : 1,
            name : 'FMB'
          })
        ]);
        return deferred.promise;
      });

      $httpBackend.expectGET( url('organizations/1/projects') ).respond(200, '{"data":[{"id":1,"name":"test","description":"test test"}]}');

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      scope.$digest();

      $httpBackend.flush();

      expect(scope.currentScope.id).toEqual(1);
      expect(scope.currentScope.name).toEqual('FMB');

      expect(scope.projects.length).toBe(1);

    });

  });

  describe('when many organizations available', function() {

    beforeEach(function() {
      $httpBackend.expectGET( url('organizations/1/projects') ).respond(200, '{"data":[{"id":1,"name":"test","description":"test test"}]}');

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          OrganizationResource.$buildRaw({
            id : 1,
            name : 'FMB'
          }),
          OrganizationResource.$buildRaw({
            id : 2,
            name : 'ST'
          })
        ]);
        return deferred.promise;
      });

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      $httpBackend.flush();

      scope.$digest();

    });

    it('switching organization should trigger a data reload', function() {

      spyOn(scope, 'loadProjects');

      scope.changeScope(scope.organizations[1]);

      scope.$digest();

      expect(scope.currentScope.id).toBe(2);
      expect(scope.loadProjects.calls.count()).toBe(1);

    });

  });

  describe('with one organization available', function() {

    beforeEach(function() {
      $httpBackend.expectGET( url('organizations/1/projects') ).respond(200, '{"data":[{"id":1,"name":"test","description":"test test"}]}');

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          OrganizationResource.$buildRaw({
            id : 1,
            name : 'FMB'
          })
        ]);
        return deferred.promise;
      });

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      $httpBackend.flush();

      scope.$digest();

    });


    describe('filters', function() {

      it('$scope.isFiltered should be `false` by default', function() {
        expect(scope.isFiltered()).toBeFalsy();
      });

      it('$scope.isFiltered should be `true` when filtering', function() {
        scope.statusFilter = 'done';
        scope.teamFilter = '';

        expect(scope.isFiltered()).toBeTruthy();
      });

      it('clear filters should restore list to defaults', function() {

        scope.statusFilter = 'done';
        scope.teamFilter = '';

        expect(scope.isFiltered()).toBeTruthy();

        scope.clearFilters();

        expect(scope.isFiltered()).toBeFalsy();

      });

    });

    describe('create project', function() {

      it('should close dialog is update succeed');

      it('should NOT close dialog is error and display message');

    });

    describe('delete project from organization', function() {

      it('should remove it from list', function() {

        $httpBackend.expectDELETE( url('organizations/1/projects/1') ).respond(200, '');

        scope.$emit('project:delete', scope.projects[0]);

        scope.$digest();

        $httpBackend.flush();

        expect(scope.projects.length).toBe(0);

      });

    });
  });

});