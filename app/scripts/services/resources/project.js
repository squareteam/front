'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function($resource, $http, $q, ApiCache) {
    var OrganizationProjectsResource;

    OrganizationProjectsResource = $resource('apis://projects', {}, {
      update: {
        method: 'PUT'
      }
    });


    function ProjectCollection (projects) {
      this.projects = projects;

      // Placeholder
      angular.forEach(this.projects, function(project) {
        project.status = 'inprogress';
        project.metadata = {
          members   : 0,
          missions  : 0,
          documents : 0,
          comments  : 0
        };
      });
    }

    ProjectCollection.prototype = {
      create : function(project) {
        // OrganizationProjectsResource.create
        return $http.post('apis://projects', project);
      },

      update : function(/*project*/) {
        // OrganizationProjectsResource.update
      },

      remove : function(/*projectId*/) {
        // OrganizationProjectsResource.remove
      }
    };

    function getProjects (url, options) {
      var defer = $q.defer();

      options = options || {};

      $http.get(url, { cache : options.apiCache ? ApiCache : false }).then(function(response) {
        defer.resolve(new ProjectCollection(response.data));
      }, defer.reject);

      return defer.promise;
    }


    function getProjectsFromOrganizationId (organizationId, options) {
      return getProjects('apis://projects', options); // FIXME(charly): undo when API ready
      // return getProjects('apis://organizations/' + organizationId + '/projects', options);
    }


    function getProjectsFromUserId (userId, options) {
      return getProjects('apis://projects', options); // FIXME(charly): undo when API ready
      // return getProjects('apis://users/' + userId + '/projects', options);
    }



    return {
      fromOrganization  : getProjectsFromOrganizationId,
      fromUser          : getProjectsFromUserId,
      get               : OrganizationProjectsResource.get,
      query             : OrganizationProjectsResource.query,
      remove            : OrganizationProjectsResource.remove,
      create            : OrganizationProjectsResource.save,
      update            : OrganizationProjectsResource.update
    };
  });