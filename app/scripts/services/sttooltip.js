/* global $ */

'use strict';

angular.module('squareteam.app')
  .service('stTooltip', function stTooltip($rootScope, $http, $q, $compile, $templateCache, $timeout) {

    var $singletonTooltip = {};


    // Tooltip API
    function wrapper (tooltipElement) {

      function onClickOutsideHandler (e) {
        if (tooltipElement === e.target || $.contains(tooltipElement, e.target)) {
          return;
        }

        if (tooltipElement.is(':visible')) {
          tooltipElement.hide();
          $(document).off('click', onClickOutsideHandler);
        }
      }

      function setupOnClickOutside () {
        $(document).on('click', onClickOutsideHandler);
      }

      function setPosition (top, left) {
        tooltipElement.css('left', left + 'px').css('top', top + 'px');
      }

      return {
        $el : tooltipElement,
        hide  : function() {
          tooltipElement.fadeOut(200);
        },
        setPosition : setPosition,
        showOnNode : function(node, topPad, leftPad, relativeCentering) {
          var offset = $(node).offset();

          if (relativeCentering || typeof relativeCentering === 'undefined') {
            setPosition(
              offset.top + (topPad || 0),
              offset.left - ((parseInt(tooltipElement.css('width'), 10) - parseInt($(node).css('width'), 10))/2) + (leftPad || 0)
            );
          } else {
            setPosition(
              offset.top + (topPad || 0),
              offset.left + (leftPad || 0)
            );
          }

          tooltipElement.css('display', 'none');
          tooltipElement.fadeIn(200);

          $timeout(function() {
            setupOnClickOutside();
          }, 300);
        },
        show : function() {
          tooltipElement.fadeIn(200);
        },
        destroy : function() {
          tooltipElement.remove();
        }
      };
    }

    /**
     * Tooltip builder
     * 
     * @param  {String} templateUrl
     * @param  {String} [name]        optional tooltip name (for singletons)
     * @param  {Scope}  scope
     * @return {Promise}
     */
    function builder (templateUrl, name, scope) {

      var deferred = $q.defer();

      if (angular.isObject(name)) {
        scope = angular.isObject(name) ? name.$new() : $rootScope.$new();
        name  = null;
      } else {
        scope =  angular.isObject(scope) ? scope.$new() : $rootScope.$new();
      }


      $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, { cache: true })).then(function(response) {
        var tooltipElement,
            lastTooltipElement,
            templateContent = angular.isString(response) ? response : response.data;

        $templateCache.put(templateUrl, templateContent);

        if (name) {

          lastTooltipElement = $singletonTooltip[name];

          tooltipElement = $singletonTooltip[name] = $compile(templateContent)(scope);

          if (lastTooltipElement) {
            lastTooltipElement.replaceWith(tooltipElement);
          } else {
            tooltipElement.appendTo(document.body);
          }

        } else {
          tooltipElement = $compile(templateContent)(scope);
          tooltipElement.appendTo(document.body);
        }

        deferred.resolve(wrapper(tooltipElement));

      }, deferred.reject);

      return deferred.promise;

    }

    return {
      open  : builder
    };

  });
