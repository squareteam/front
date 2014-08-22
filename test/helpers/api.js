'use strict';

/**
 * Helper to generate api response string
 * @param  {String|Array} error
 * @param  {Object|Array} data
 * @return {String}
 */
function apiResponseAsString (error, data) {
  return JSON.stringify({
    errors : error ? error : null,
    data   : data  ? data  : null
  });
}

/**
 * Helper to generate api url (depending on config)
 * @param  {AUTO.$injector} $injector
 * @return {Function}
 */
function apiURL ($injector) {
  return function(path) {
    return $injector.get('appConfig').api.url + path;
  };
}