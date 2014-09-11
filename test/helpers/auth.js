/* global CryptoJS */

'use strict';

/**
 * Provide a mock but valid auth for testing
 * components that require authentification
 *
 * @method provideAuth
 * @param  {angular.injector} $injector
 * @return {Function}
 */
function provideAuth ($injector) {
  return function(login, token) {
    var _login     = login  || 'charly.poly@live.fr',
        _token     = token  || 'a99246bedaa6cadacaa902e190f32ec689a80a724aa4a1c198617e52460f74d1',
        ApiAuth   = $injector.get('ApiAuth');

    $injector.get('CurrentSession').$$user = $injector.get('UserResource').$buildRaw({ id : 1, name : 'test-auth', email : _login});
    $injector.get('CurrentSession').$$auth = new ApiAuth(_login, CryptoJS.enc.Hex.parse(_token));
  };
}

/**
 * Provide a invalid auth for testing
 * components that require authentification
 *
 * @method provideAnonymousAuth
 * @param  {angular.injector} $injector
 * @return {Function}
 */
function provideAnonymousAuth ($injector) {
  return function() {
    var ApiAuth   = $injector.get('ApiAuth');

    $injector.get('CurrentSession').$$user = null;
    $injector.get('CurrentSession').$$auth = new ApiAuth();
  };
}