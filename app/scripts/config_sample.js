// THIS IS A SAMPLE FILE, DO NOT EDIT
// COPY ME to `config.js` and edit it
'use strict';
angular.module('squareteam.app').factory('appConfig', function () {
  var api = {
    host      : 'http://127.0.0.1:1551',
    path      : '/api/',
    storageNS : 'ST_SESSION'
  };

  api.url = api.host + api.path;

  return {
    api : api
  };
});