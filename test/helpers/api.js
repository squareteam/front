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