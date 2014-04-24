/*global CryptoJS*/
'use strict';

angular.module('squareteam.api')
.service('ApiCrypto', function Apicrypto(Currentuser, appConfig, $log) {
  return {
    generateToken     : function(login, password, salt1, salt2) {
      var pbkdf2  = CryptoJS.PBKDF2(password, salt1, { keySize: 256/32, iterations: 1000, hasher : CryptoJS.algo.SHA256 }),
          hmac    = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, salt2.concat(pbkdf2));

      hmac.update(login);
      return hmac.finalize(); // return token as WordArray
    },
    transformRequest  : function(config) {
      $log.info('Preparing request', config);

      var currentUser = Currentuser.getAuth(),
      headers,
      hmac,
      path,
      data = config.data,
      blob = [];

      path = config.url.replace(appConfig.api.url, '');

      if (path[0] !== '/') {
        path = '/' + path;
      }

      if (data && angular.isObject(data)) {
        angular.forEach(Object.keys(data).sort(), function(key) {
          if (data.hasOwnProperty(key)) {
            blob.push( key + '=' + encodeURIComponent(data[key]) );
          }
        });
      }

      headers = {
        'St-Identifier' : currentUser.identifier,
        'St-Timestamp'  : Math.round(Date.now() / 1000)
      };

      hmac = CryptoJS.algo.HMAC.create(
       CryptoJS.algo.SHA256,
       currentUser.token
      );

      hmac.update(config.method + ':');
      hmac.update(path + ':');
      hmac.update(headers['St-Timestamp'] + ':');
      hmac.update(blob.join('&'));

      headers['St-Hash'] = hmac.finalize().toString();

      angular.extend(config.headers, headers);

      $log.info('AFTER', config);

      return config;
    }
  };
});
