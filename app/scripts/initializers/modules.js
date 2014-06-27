'use strict';

angular.module('squareteam.ressources', [
  'ngCookies',
  'ngResource'
]);

angular.module('squareteam.api', ['pascalprecht.translate']);

angular
  .module('squareteam.app', [
    'squareteam.api',
    'squareteam.ressources',
    'ngSanitize',
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics'
  ]);


angular.module('squareteam.app').value('lodash', window._);

// DO NOT EDIT LINE BELOW
//  open README.md for more explaination
var version = '0.2.5';
angular.module('squareteam.app').value('VERSION', version);
