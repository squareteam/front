/*global CryptoJS*/
'use strict';

angular.module('squareteam.api')
  .service('ApiCrypto', function Apicrypto($injector, appConfig) {

    this.generateToken = function(login, password, salt1, salt2) {
      var pbkdf2  = CryptoJS.PBKDF2(password, salt1, { keySize: 256/32, iterations: 1000, hasher : CryptoJS.algo.SHA256 }),
          hmac    = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, salt2.concat(pbkdf2));

      hmac.update(login);
      return hmac.finalize(); // return token as WordArray
    };
      /**
       * Return secure headers
       * @param  {ApiAuth} auth
       * @param  {Object}  request
       * @return {Object}
       */
    this.generateHeaders = function(auth, url, method, data) {
      var headers,
          hmac,
          path,
          blob = [];

      path = url.replace(appConfig.api.host, '');

      if (path[0] !== '/') {
        path = '/' + path;
      }

      if (data && angular.isObject(data)) {
        angular.forEach(Object.keys(data).sort(), function(key) {
          // see http://apidock.com/rails/v2.3.2/Rack/Utils/escape
          // escape called on key/value by Rack::Utils.build_query, used in our API
          blob.push( encodeURIComponent(key).replace('%20', '+') + '=' + encodeURIComponent(data[key]).replace('%20', '+') );
        });
      }

      headers = {
        'St-Identifier' : auth.identifier,
        'St-Timestamp'  : Math.round(Date.now() / 1000)
      };

      hmac = CryptoJS.algo.HMAC.create(
       CryptoJS.algo.SHA256,
       auth.token
      );

      hmac.update(method + ':');
      hmac.update(path + ':');
      hmac.update(headers['St-Timestamp'] + ':');
      hmac.update(blob.join('&'));

      headers['St-Hash'] = hmac.finalize().toString();

      headers['X-Requested-With'] = 'XMLHttpRequest';

      return headers;
    };

    this.transformRequest = function(config) {

      var current = $injector.get('CurrentSession'),
          auth    = current.getAuth();

      if (!current.isAuthenticated()) {
        throw new Error('Cannot load ' + config.url + ' without being authenticated !');
      }

      angular.extend(config.headers, this.generateHeaders(auth, config.url, config.method, config.data));

      return config;
    };

  });
