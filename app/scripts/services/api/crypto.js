/*global CryptoJS, toString*/
'use strict';

// Provide 3 important methods :
// 
//  - `generateToken`     generate a unique session token
//                        (salt1 is unique per login)
//  
//  - `generateHeaders`   generate required auth headers from an (auth, url, method, data)
//                          1. Client must generate a __BLOB__ from the request data sorted by key:
//                            BLOB = JSON.stringify(data_deeply_sorted_by_key)
//
//                          2. Client generates a __TIMESTAMP__
//
//                          3. Client computes a __HASH__ (using his token)
//                            HASH = HMAC_SHA256(TOKEN, HTTP_Method + ":" + URL_PATH + ":" + TIMESTAMP + ":" + BLOB)
//
//                          4. Client adds the three St fields in the request HTTP header:
//                            - "St-Identifier": user_identifier
//                            - "St-Timestamp" : TIMESTAMP
//                            - "St-Hash"      : HASH
//
//                          5. Client sends data (in the same order than the blob) with the custom HTTP header.
//                          
//  - `transformRequest`  transform a given request to add auth required headers

angular.module('squareteam.api')
  .service('ApiCrypto', function Apicrypto($injector, appConfig) {

    this.$generateBlob = function(data) {
      function encodeUriQuery(val) {
        return encodeURIComponent(val).
          replace(/%40/gi, '@').
          replace(/%3A/gi, ':').
          replace(/%24/g,  '$').
          replace(/%2C/gi, ',').
          replace(/%20/g,  '+');
      }

      function dirtyStringify (value, key) {
        var buffer = [];
        if (angular.isObject(value)) {
          var keys = Object.keys(value);
          keys.sort();
          for(var i = 0; i < keys.length; i++) {
            buffer.push(dirtyStringify(value[keys[i]], key ? [key,'{', keys[i] ,'}'].join('') : keys[i]));
          }
          return buffer.join('&');
        } else if (angular.isArray(value)) {
          for(var j = 0; j < value.length; j++) {
            buffer.push(dirtyStringify(value[j], [key,'[]'].join('')));
          }
          return buffer.join('&');
        } else {
          return [key, '=', encodeUriQuery(value)].join('');
        }
      }

      return dirtyStringify(data);
    };

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
          blob = '';

      path = url.replace(appConfig.api.host, '');

      if (path[0] !== '/') {
        path = '/' + path;
      }

      if (data && (angular.isObject(data) || angular.isArray(data) )) {
        blob = this.$generateBlob(data);
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
      hmac.update(blob);

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
