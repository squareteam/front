'use strict';

angular.module('squareteam.ressources', [
  'ngCookies',
  'ngResource'
]);

angular.module('squareteam.api', []);

angular
  .module('squareteam.app', [
    'squareteam.api',
    'squareteam.ressources',
    'ngSanitize',
    'ui.router'
  ]);


// DO NOT EDIT LINE BELOW
//  open README.md for more explaination
var version = '0.0.7';
angular.module('squareteam.app').value('VERSION', version);
