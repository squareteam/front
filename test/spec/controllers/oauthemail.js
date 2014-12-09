'use strict';

describe('Controller: OAuthEmailConfirmCtrl', function () {

  // load the controller's module
  beforeEach(module('squareteam.app', function($provide) {
    $provide.factory('appConfig', function () {
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
  }));

  var OAuthEmailConfirmCtrl, ApiOAuth, stUtils,
      $rootScope, $state, $controller, $location,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $rootScope  = $injector.get('$rootScope');
    $state      = $injector.get('$state');
    $controller = $injector.get('$controller');
    $location   = $injector.get('$location');

    ApiOAuth    = $injector.get('ApiOAuth');
    stUtils     = $injector.get('stUtils');

    scope = $rootScope.$new();
  }));

  it('should redirect to login if oauth params missing', function () {

    spyOn($state, 'go');
    spyOn(ApiOAuth, 'isOAuthEmailMissingRequest').and.returnValue(false);

    OAuthEmailConfirmCtrl = $controller('OAuthEmailConfirmCtrl', {
      $scope: scope
    });

    expect($state.go).toHaveBeenCalledWith('public.login');

  });

  // TODO(charly): handle error with unknown provider

  describe('when user confirm an email', function() {

    it('should redirect to /api/auth/:provider?email=xxx', function () {

      spyOn(stUtils, 'redirect');
      spyOn(ApiOAuth, 'isOAuthEmailMissingRequest').and.returnValue(true);
      spyOn($location, 'search').and.returnValue({
        provider : 'github'
      });
      spyOn(ApiOAuth, 'providerConfig').and.returnValue({
        endpoint : 'http://localhost:8000/api/auth/github/'
      });

      OAuthEmailConfirmCtrl = $controller('OAuthEmailConfirmCtrl', {
        $scope: scope
      });

      scope.user = {
        email : 'charly@squareteam.io'
      };

      scope.confirm();

      $rootScope.$digest();

      expect(stUtils.redirect).toHaveBeenCalledWith('http://localhost:8000/api/auth/github/?email=charly@squareteam.io');

    });

  });
});
