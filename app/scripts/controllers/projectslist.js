'use strict';

angular.module('squareteam.app')
  .controller('ProjectsListCtrl', function ($scope, $rootScope, ngDialog, ProjectResource, UserResource, CurrentSession, moment) {

    $scope.organizations  = [];
    $scope.sortBy         = '';
    $scope.teamFilter     = '';
    $scope.statusFilter   = '';
    $scope.currentUser    = CurrentSession.getUser();

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

      if (!$scope.currentScope) {
        if ($scope.organizations.length) {
          $scope.currentScope = $scope.organizations[0];
        } else {
          $scope.currentScope = $scope.currentUser;
        }
      }

      $scope.currentScope.projects.$refresh().$then(projectsLoaded);

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

    $scope.currentScopeIsUser = function() {
      return $scope.currentScope && $scope.currentScope.constructor.$name() === 'users';
    };

    $scope.filteredOrganizations = function() {
      var organizations = [];

      if (!$scope.currentScope || ($scope.currentScope && $scope.currentScope.constructor.$name() === 'users') ) {
        organizations = $scope.organizations;
      } else {
        angular.forEach($scope.organizations, function(organization) {
          if (organization.id !== $scope.currentScope.id) {
            organizations.push(organization);
          }
        });
      }

      return organizations;
    };

    $scope.isFiltered = function() {
      return $scope.teamFilter || $scope.statusFilter;
    };

    $scope.clearFilters = function() {
      $scope.teamFilter     = '';
      $scope.statusFilter   = '';
    };

    $scope.changeScope = function(scope) {
      $scope.currentScope = scope;
      $scope.loadProjects();
    };

    $scope.createProjectPopin = function() {
      var dialog,
          createProjectPopinScope = $rootScope.$new();

      createProjectPopinScope.createProject = function() {

        if (createProjectPopinScope.project.deadline) {
          createProjectPopinScope.project.deadline = moment(createProjectPopinScope.project.deadline).toISOString();
        }

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
