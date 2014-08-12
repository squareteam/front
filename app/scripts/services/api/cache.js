'use strict';

// Squareteam API cache
// 
//  GET /api/projects/
//  ->  [
//        {
//          id : 1,
//          name : "test"
//        }
//      ]
//  
//  Will create cache for each results
//    - projects:1 { id : 1, name : "test" }
//    - projects:2 [...]
//    
//    
//    
//  TODO :
//    - make configurable
//      - make ApiCache a provider
//      - $interceptors = { get: ..., put: ... }
//

angular.module('squareteam.api')
  .provider('ApiCache', function ApiCache() {
    
    var $inflections = this.$inflections = {}; // references

    this.$capacity = 30;

    this.$get = ['$cacheFactory', 'appConfig', function($cacheFactory, appConfig) {

      var apiRequestItemRegex = new RegExp('^' + appConfig.api.url+ '([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9]+))'),
          apiRequestCollectionRegex = new RegExp('^' + appConfig.api.url + '([a-zA-Z0-9]+)$'),
          cache;



      cache = $cacheFactory('apiCache', {
        capacity : this.$capacity
      });

      function getSingular (resourceNamePlural) {
        if ($inflections[resourceNamePlural]) {
          return $inflections[resourceNamePlural];
        } else {
          return resourceNamePlural[resourceNamePlural.length - 1] === 's' ? resourceNamePlural.substr(0, resourceNamePlural.length - 1) : resourceNamePlural;
        }
      }

      return {
        info      : cache.info,
        put       : function (requestUrl, results) {
          var matches = requestUrl.match(apiRequestCollectionRegex);
          if (matches && matches.length === 2) {
            var resourceName = getSingular(matches[1]),
                keys         = [],
                key;

            angular.forEach(results, function(result) {
              key = [resourceName, result.id].join(':');
              keys.push(key);
              cache.put(key, result);
            });

            cache.put([requestUrl,'keys'].join(':'), keys);
          }
          cache.put(requestUrl, results);

          return results;
        },
        get       : function (requestUrl) {
          var matches = requestUrl.match(apiRequestItemRegex);
          if (matches && matches.length === 3) {
            var resourceName = getSingular(matches[1]),
                resourceId   = matches[2],
                results      = cache.get([resourceName, resourceId].join(':'));
            return results ? results : cache.get(requestUrl);
          } else {
            return cache.get(requestUrl);
          }
        },
        remove    : function(requestUrl) {
          cache.remove(requestUrl);
          var associatedKeys = this.get([requestUrl,'keys'].join(':'));
          if (associatedKeys) {
            angular.forEach(associatedKeys, function(key) {
              cache.remove(key);
            });
            cache.remove([requestUrl,'keys'].join(':'));
          }
        },
        removeAll : cache.removeAll,
        destroy   : cache.destroy
      };
    }];
  });
