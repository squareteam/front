'use strict';

angular.module('squareteam.resources', [
  'ngCookies',
  'ngResource'
]);

angular.module('squareteam.api', ['pascalprecht.translate']);

angular
  .module('squareteam.app', [
    'squareteam.api',
    'squareteam.resources',
    'ngSanitize',
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics'
  ]);


angular.module('squareteam.app').value('lodash', window._);

// DO NOT EDIT LINE BELOW
//  open README.md for more explaination
var version = '0.3.2';
angular.module('squareteam.app').value('VERSION', version);
