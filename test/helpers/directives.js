'use strict';


function updateIsolateScope (element, data) {
  var directiveScope = element.isolateScope();
  directiveScope = angular.extend(directiveScope, data);
  element.data('$isolateScope', directiveScope);
}