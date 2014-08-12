/* global $ */

'use strict';

angular.module('squareteam.app')
  .directive('stTopBar', function () {
    return {
      templateUrl: 'scripts/directives/templates/sttopbar.html',
      restrict: 'E',
      replace: true,
      controller: function() {

        // use setTimeout cause it's not watcher or data related
        setTimeout(function() {
          $('nav .item').each(function(i, el) {
            // IIFE for scope
            (function(_i) {
              setTimeout(function() {
                $(el).addClass('visible');
              }, _i * 100);
            })(i);
          });
        },500);

      }
    };
  });
