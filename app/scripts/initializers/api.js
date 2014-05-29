'use strict';

angular.module('squareteam.api')
  .config(function($httpProvider) {
    // Plug interceptor on $http service
    $httpProvider.interceptors.push('ApiHttpInterceptors');
  });