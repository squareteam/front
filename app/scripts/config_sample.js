// THIS IS A SAMPLE FILE, DO NOT EDIT
// COPY ME to `config.js` and edit it
'use strict';
angular.module('squareteam.app').factory('appConfig', function () {
  var api = {
    host      : 'http://localhost:8000',
    path      : '/api/',
    storageNS : 'st.session'
  };

  api.url             = api.host + api.path;
  api.oauth = {
    cookieNS  : 'st.oauth'
  };

  api.oauth.github = {
    endpoint  : api.url + 'auth/github',
    iconPath  : 'logo_github.png',
    name      : 'Github'
  };


  return {
    api : api
  };
});
