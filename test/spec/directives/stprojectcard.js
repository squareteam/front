/* global provideAuth, apiURL */

'use strict';

xdescribe('Directive: st-project-card', function () {

  // load the directive's module
  beforeEach(module('scripts/directives/templates/stprojectcard.html'));
  beforeEach(module('squareteam.app'));

  var element, scope, tooltipScope, changeProjectStatusScope,
      url, ProjectResourceCustom,
      $httpBackend, $rootScope, ngDialog;

  beforeEach(inject(function ($injector, $compile, restmod) {

    $rootScope    = $injector.get('$rootScope');
    $httpBackend  = $injector.get('$httpBackend');
    ngDialog      = $injector.get('ngDialog');

    url = apiURL($injector);

    scope = $rootScope.$new();

    provideAuth($injector)();

    ProjectResourceCustom = restmod.model('apis://projects', {
      deadline : {
        encode : function(value) {
          return value ? value : '';
        },
        chain: true
      },
      metadata  : { mask : 'CUD'},
      progress  : { mask : 'CUD'},
      status    : { mask : 'CUD'}
    });

    scope.project = ProjectResourceCustom.$buildRaw({
      id          : 1,
      title       : 'Mobile App',
      description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
    });

    element = $compile('<st-project-card project="project"></st-project-card>')(scope);

    $rootScope.$digest();

    tooltipScope = element.isolateScope().$$childHead;
    changeProjectStatusScope = tooltipScope.$$nextSibling;

  }));


  describe('project update', function() {

    it('should display modal then save updates', function() {

      var updateProjectScope = null;

      $httpBackend.expectPUT( url('projects/1') ).respond(200, '');

      spyOn(ngDialog, 'open').and.callFake(function(config) {
        updateProjectScope = config.scope;
        return {
          close : function() {}
        };
      });

      tooltipScope.edit();

      $rootScope.$digest();

      updateProjectScope.updateProject();

      $rootScope.$digest();

      $httpBackend.flush();

      expect(ngDialog.open.calls.count()).toBe(1);

    });

    it('should display an error message if failure');

  });

  describe('project status change', function() {

    it('should save updates', function() {

      $httpBackend.expectPUT( url('projects/1') ).respond(200, '');

      changeProjectStatusScope.status('inprogress');

      $rootScope.$digest();

      $httpBackend.flush();

      expect(scope.project.status).toBe('inprogress');

    });

  });

  describe('project delete', function() {

    it('should emit "project:delete" event on scope', function() {

      spyOn(element.isolateScope(), '$emit');

      tooltipScope.delete();

      $rootScope.$digest();

      expect(element.isolateScope().$emit).toHaveBeenCalledWith('project:delete', scope.project);

    });

  });

  xdescribe('project archive', function() {});

});
