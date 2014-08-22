/* global provideAuth, apiURL */

'use strict';

describe('Controller: ProjectsListCtrl', function () {

  beforeEach(module('views/app/projects/create_project_popin.html'));
  beforeEach(module('squareteam.app'));

  var ProjectsListCtrl, scope, resolvePromise, url,
      PasswordConfirmPopin, CurrentSession, ApiSession, UserResource,
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

    url = apiURL($injector);

    provideAuth($injector)();

    scope = $rootScope.$new();

    $httpBackend.expectGET( url('projects') ).respond(200, '{"data":[{"id":1,"name":"test","description":"test test"}]}');

  }));


  describe('should load projects', function() {

    it('from User if CurrentSession.getOrganizations() is empty');

    it('from User first Organization if no $scope.organization');

    it('from given Organization if $scope.organization');

  });

  describe('filters', function() {

    beforeEach(function() {

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          {
            id : 1,
            name : 'FMB'
          }
        ]);
        return deferred.promise;
      });

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      $httpBackend.flush();

      scope.$digest();

    });
    
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

    beforeEach(function() {

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          {
            id : 1,
            name : 'FMB'
          }
        ]);
        return deferred.promise;
      });

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      $httpBackend.flush();

      scope.$digest();

    });

    it('should close dialog is update succeed');

    it('should close dialog is error and display message');

  });

  describe('delete project', function() {

    beforeEach(function() {

      spyOn(CurrentSession, 'getOrganizations').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve([
          {
            id : 1,
            name : 'FMB'
          }
        ]);
        return deferred.promise;
      });

      ProjectsListCtrl = $controller('ProjectsListCtrl', {
        $scope: scope
      });

      $httpBackend.flush();

      scope.$digest();

    });

    it('should remove it from list', function() {

      $httpBackend.expectDELETE( url('projects/1') ).respond(200, '');

      scope.$emit('project:delete', scope.projects[0]);

      scope.$digest();

      $httpBackend.flush();

      expect(scope.projects.length).toBe(0);

    });

  });

});