'use strict';

angular.module('squareteam.app')
  .controller('ProjectsListCtrl', function ($scope, $rootScope, ngDialog, ProjectResource,  CurrentSession, restmod) {

    var tmpProjectModel = restmod.model('apis://projects', {
      deadline : {
        encode : function(value) {
          return value ? value : '';
        },
        chain: true
      },
      metadata  : { mask : 'CUD'},
      progress  : { mask : 'CUD'},
      status    : { mask : 'CUD'}
    });

    $scope.organizations  = [];
    $scope.sortBy         = '';
    $scope.teamFilter     = '';
    $scope.statusFilter   = '';

    $scope.statusFilterChoices = [
      {
        label   : 'directives.stProjectCard.status.inprogress',
        color   : '#57c0df',
        value   : 'inprogress'
      },
      {
        label   : 'directives.stProjectCard.status.due',
        color   : '#ff6e83',
        value   : 'due'
      },
      {
        label   : 'directives.stProjectCard.status.validation',
        color   : '#cf83c0',
        value   : 'validation'
      },
      {
        label   : 'directives.stProjectCard.status.done',
        color   : '#73c26D',
        value   : 'done'
      },
      {
        label   : 'directives.stProjectCard.status.paused',
        color   : '#9cb6be',
        value   : 'paused'
      }
    ];

    $scope.teamFilterChoices = [
      {
        label   : 'Team Panda',
        color   : '#57c0df',
        value   : 'panda'
      },
      {
        label   : 'Team Tiger',
        color   : '#73c26D',
        value   : 'tiger'
      },
      {
        label   : 'Team Snow',
        color   : '#ff6e83',
        value   : 'snow'
      }
    ];

    $scope.sortChoices = [
      {
        label   : 'app.projects.sort.deadline',
        value   : 'deadline',
        dir     : 'asc'
      },
      {
        label   : 'app.projects.sort.deadline',
        value   : '-deadline',
        dir     : 'desc'
      },
      {
        label   : 'app.projects.sort.progress',
        value   : 'progress',
        dir     : 'asc'
      },
      {
        label   : 'app.projects.sort.progress',
        value   : '-progress',
        dir     : 'desc'
      },
      {
        label   : 'app.projects.sort.date',
        value   : 'created_at',
        dir     : 'asc'
      },
      {
        label   : 'app.projects.sort.date',
        value   : '-created_at',
        dir     : 'desc'
      }
    ];

    $scope.loadProjects = function() {
      function projectsLoaded (projects) {
        $scope.projects = projects;

        // MOCKS..
        var status = ['inprogress', 'paused', 'validation', 'done', 'due'];
        angular.forEach($scope.projects, function(project) {
          project.status = status[Math.floor(Math.random()*status.length)];
          project.progress = Math.ceil(Math.random() * 100) + '%';
          project.metadata = {
            members   : 0,
            missions  : 0,
            documents : 0,
            comments  : 0
          };
        });
      }

      if ($scope.organization) {
        tmpProjectModel.$search().$then(projectsLoaded);
        // $scope.organization.projects.$refresh().$then(projectsLoaded);
      } else if ($scope.organizations.length) {
        $scope.organization = $scope.organizations[0];

        tmpProjectModel.$search().$then(projectsLoaded);
        // $scope.organization.projects.$refresh().$then(projectsLoaded);
      } else {
        $scope.organization = null;

        tmpProjectModel.$search().$then(projectsLoaded);
        // CurrentSession.getUser().projects.$refresh().then(projectsLoaded);
      }

    };

    // INIT

    CurrentSession.getOrganizations().then(function(_organizations) {
      $scope.organizations = _organizations;

      // Load projects at startup
      $scope.loadProjects();
    });

    $scope.$on('project:delete', function(_, project) {
      project.$destroy();
      // TODO(charly): handle error message
    });

    // METHODS

    $scope.organizationsSelectorFilter = function(actual, expected) {
      return actual.id !== expected.id;
    };

    $scope.isFiltered = function() {
      return $scope.teamFilter || $scope.statusFilter;
    };

    $scope.clearFilters = function() {
      $scope.teamFilter     = '';
      $scope.statusFilter   = '';
    };

    $scope.changeOrganization = function(organization) {
      $scope.organization = organization;
      $scope.loadProjects();
    };

    $scope.createProjectPopin = function() {
      var dialog,
          createProjectPopinScope = $rootScope.$new();

      createProjectPopinScope.createProject = function() {
        $scope.projects.$create(createProjectPopinScope.project).$then(function() {
          $scope.loadProjects();
          dialog.close();
        });
      };

      dialog = ngDialog.open({
        template  : 'views/app/projects/create_project_popin.html',
        scope     : createProjectPopinScope
      });
    };

  });
