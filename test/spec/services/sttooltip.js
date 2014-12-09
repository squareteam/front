/* global $ */

'use strict';

describe('Service: stTooltip', function () {

  // load the service's module
  beforeEach(module('squareteam.app'));

  // instantiate service
  var stTooltip,
      $templateCache, $httpBackend, $rootScope;

  beforeEach(inject(function ($injector) {
    $templateCache  = $injector.get('$templateCache');
    $httpBackend    = $injector.get('$httpBackend');
    $rootScope      = $injector.get('$rootScope');

    stTooltip = $injector.get('stTooltip');

  }));

  describe('when building a tooltip', function() {

    describe('', function() {
      beforeEach(function() {
        $httpBackend.expectGET('/mytemplate.html').respond(200, '<div></div>');
      });

      it('should cache template files', function() {

        spyOn($templateCache, 'put');

        stTooltip.open('/mytemplate.html');

        $httpBackend.flush();

        $rootScope.$digest();

        expect($templateCache.put.calls.count()).toBe(1);

      });

      it('should create a scope if none given', function() {

        spyOn($rootScope, '$new').and.callThrough();

        stTooltip.open('/mytemplate.html');

        $httpBackend.flush();

        $rootScope.$digest();

        expect($rootScope.$new.calls.count()).toBe(1);

      });

      it('should create a child scope from given scope', function() {
        var scope = $rootScope.$new();

        spyOn(scope, '$new').and.callThrough();

        stTooltip.open('/mytemplate.html', scope);

        $httpBackend.flush();

        $rootScope.$digest();

        expect(scope.$new.calls.count()).toBe(1);

      });
    });

    describe('with a name', function() {

      beforeEach(function() {
        $('.test-across-calls').remove();

        $httpBackend.expectGET('/mytemplate-with-class.html').respond(200, '<div class="test-across-calls"></div>');
      });

      it('should replace node content across calls', function() {

        stTooltip.open('/mytemplate-with-class.html', 'test-across-calls');

        $httpBackend.flush();

        $rootScope.$digest();

        stTooltip.open('/mytemplate-with-class.html', 'test-across-calls');

        $rootScope.$digest();

        expect($('.test-across-calls').length).toBe(1);

      });

    });

    describe('WITHOUT a name', function() {

      beforeEach(function() {
        $('.test-across-calls').remove();

        $httpBackend.expectGET('/mytemplate-with-class.html').respond(200, '<div class="test-across-calls"></div>');
      });

      it('should append template to body at each call', function() {

        stTooltip.open('/mytemplate-with-class.html');

        $httpBackend.flush();

        $rootScope.$digest();

        stTooltip.open('/mytemplate-with-class.html');

        $rootScope.$digest();

        expect($('.test-across-calls').length).toBe(2);

      });

    });

  });

  // Not compatible /w PhantomJS

  xdescribe('when using $tooltip.showOnNode, $tooltip', function() {

    beforeEach(function() {
      $('.test-across-calls').remove();
      $('.reference_node').remove();

      $httpBackend.expectGET('/mytemplate-with-style.html').respond(200, '<div style="width:200px; height:40px;">TEST</div>');

      $(document.body).append('<div class="reference_node" style="width:40px; height:40px;"></div>');
    });

    it('must be centered on given node', function() {
      var tooltipElement;

      stTooltip.open('/mytemplate-with-style.html').then(function($tooltip) {
        $tooltip.showOnNode($('.reference_node').first());
        tooltipElement = $tooltip.$el;
      });

      $httpBackend.flush();

      $rootScope.$digest();

      expect(tooltipElement.css('left')).toBe('-72px');
      expect(tooltipElement.css('top')).toBe('8px');

    });

    it('must be centered on given node and take padding options in account', function() {

      var tooltipElement;

      stTooltip.open('/mytemplate-with-style.html').then(function($tooltip) {
        $tooltip.showOnNode($('.reference_node').first(), 20, 10);
        tooltipElement = $tooltip.$el;
      });

      $httpBackend.flush();

      $rootScope.$digest();

      expect(tooltipElement.css('left')).toBe('-62px');
      expect(tooltipElement.css('top')).toBe('68px');

    });

  });

});
