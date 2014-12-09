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
    'angulartics.google.analytics',
    'ngDialog',
    'restmod',
    'angularMoment',
    'truncate',
    'angular-svg-round-progress'
  ]);


angular.module('squareteam.app').value('_', window._);

// DO NOT EDIT LINE BELOW
//  open README.md for more explaination
var version = '0.4.1';
angular.module('squareteam.app').value('VERSION', version);
