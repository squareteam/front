'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app', function($provide) {

    $provide.service('appConfig', function () {
      var api = {
        host      : 'http://dev.squareteam.io',
        path      : '/api/',
        storageNS : 'st.session'
      };

      api.url   = api.host + api.path;
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

    $provide.service('ApiSession', function($q) {
      this.login = function() {
        var defer = $q.defer();
        defer.resolve();
        return defer.promise;
      };
    });

    $provide.service('$state', function() {
      this.go = function() {};
    });
  }));

  var LoginCtrl, ApiSession,
      $state, $controller, $cookies, $location, $rootScope,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {

    ApiSession  = $injector.get('ApiSession');
    $state      = $injector.get('$state');
    $controller = $injector.get('$controller');
    $cookies    = $injector.get('$cookies');
    $location   = $injector.get('$location');
    $rootScope  = $injector.get('$rootScope');

    scope = $rootScope.$new();
  }));


  it('should do nothing if "email" param is missing', function() {
    spyOn(ApiSession, 'login');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });

    expect(ApiSession.login.calls.count()).toBe(0);
  });

  it('should do nothing if "provider" param is missing', function() {
    spyOn(ApiSession, 'login');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });

    expect(ApiSession.login.calls.count()).toBe(0);
  });

  it('should do nothing if "oauth token cookie" is missing', function() {
    spyOn(ApiSession, 'login');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });

    expect(ApiSession.login.calls.count()).toBe(0);
  });

  it('it try to login if all params and cookies are present', function() {

    spyOn($location, 'search').and.returnValue({
      provider : 'github',
      email    : 'charly'
    });

    $cookies['st.oauth'] = 'oauth_token';
    spyOn(ApiSession, 'login').and.callThrough();
    spyOn($state, 'go');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });

    $rootScope.$digest();

    expect(ApiSession.login).toHaveBeenCalledWith('charly','oauth_token');
    expect($state.go).toHaveBeenCalledWith('app.home');

    expect($cookies['st.oauth']).toBeUndefined();
  });

});
