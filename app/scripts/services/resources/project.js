'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function($resource, $http, $q, ApiCache) {
    var ProjectResource;

    ProjectResource = $resource('apis://projects/:id', {}, {
      update: {
        method: 'PUT'
      }
    });


    function ProjectCollection (projects) {
      this.projects = projects;
    }

    ProjectCollection.prototype = {
      create : function(/*project*/) {

      },

      update : function(/*project*/) {

      },

      remove : function(/*projectId*/) {

      }
    };


    function getProjects (id, options) {
      var defer = $q.defer();

      options = options || {};

      defer.resolve(new ProjectCollection([
        {
          id : 1,
          title         : 'Site mobile',
          createdAtDate : '21/04/2014',
          deadlineDate  : '21/04/2015',
          progress      : '50%',
          status        : 'inprogress',
          description   : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque earum laudantium, rem dicta recusandae, error temporibus quasi excepturi, minus repellendus inventore maiores tenetur.',
          metadata      : {
            members   : 5,
            missions  : 3,
            documents : 10,
            comments  : 0
          }
        },
        {
          id : 2,
          title         : 'Landing page',
          createdAtDate : '21/04/2014',
          deadlineDate  : '21/04/2015',
          progress      : '5%',
          status        : 'paused',
          description   : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque earum laudantium, rem dicta recusandae, error temporibus quasi excepturi, minus repellendus inventore maiores tenetur.',
          metadata      : {
            members   : 5,
            missions  : 3,
            documents : 10,
            comments  : 0
          }
        },
        {
          id : 3,
          title         : 'FMB',
          createdAtDate : '21/04/2014',
          deadlineDate  : '21/04/2015',
          progress      : '20%',
          status        : 'due',
          description   : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque earum laudantium, rem dicta recusandae, error temporibus quasi excepturi, minus repellendus inventore maiores tenetur.',
          metadata      : {
            members   : 5,
            missions  : 3,
            documents : 10,
            comments  : 0
          }
        },
        {
          id : 4,
          title         : 'PaaS',
          createdAtDate : '21/04/2014',
          deadlineDate  : '21/04/2015',
          progress      : '80%',
          status        : 'validation',
          description   : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque earum laudantium, rem dicta recusandae, error temporibus quasi excepturi, minus repellendus inventore maiores tenetur.',
          metadata      : {
            members   : 5,
            missions  : 3,
            documents : 10,
            comments  : 0
          }
        },
        {
          id : 5,
          title         : 'Site mobile',
          createdAtDate : '21/04/2014',
          deadlineDate  : '21/04/2015',
          progress      : '100%',
          status        : 'done',
          description   : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque earum laudantium, rem dicta recusandae, error temporibus quasi excepturi, minus repellendus inventore maiores tenetur.',
          metadata      : {
            members   : 5,
            missions  : 3,
            documents : 10,
            comments  : 0
          }
        }
      ]));

      // $http.get('apis://projects/'+ id, { cache : options.apiCache ? ApiCache : false }).then(function(response) {
      //   defer.resolve(new Project(response.data));
      // }, defer.reject);

      return defer.promise;
    }

    return {
      load    : getProjects,
      get     : ProjectResource.get,
      query   : ProjectResource.query,
      remove  : ProjectResource.remove,
      update  : ProjectResource.update
    };
  });