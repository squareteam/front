/* globals $ */

'use strict';

angular.module('squareteam.app')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, $rootScope, $state, ProjectResource, CurrentSession, moment, ngDialog, _) {

    // SORT, FILTERS

    $scope.draftsOnly = {
      draft : 1
    };

    $scope.sortBy = '';
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

    $scope.assigneeFilter = '';

    $scope.isFiltered = function() {
      return $scope.assigneeFilter || $scope.statusFilter;
    };

    $scope.clearFilters = function() {
      $scope.teamFilter       = '';
      $scope.assigneeFilter   = '';
    };

    // MAIN

    ProjectResource.$search().$then(function(projects) {
      $scope.projects = projects;
      $scope.loadMissions();
    });

    $scope.loadMissions = function() {
      function missionsLoaded (missions) {
        $scope.missions = missions;
      }

      if (!$scope.project && !!$stateParams.projectId) {
        $scope.project = _.find($scope.projects, { id : +$stateParams.projectId});
      }

      if (!$scope.project) {
        $scope.project = $scope.projects[0];
      }

      $scope.project.missions.$refresh().$then(missionsLoaded);

    };

    $scope.changeProject = function(project) {
      if (project.ownerType === 'users') {
        $state.go('app.user_project_missions', {
          userId: project.owner.id,
          projectId : project.id
        });
      } else {
        $state.go('app.organization_project_missions', {
          organizationId: project.owner.id,
          projectId : project.id
        });
      }
    };

    $scope.filteredProjects = function() {
      return (!!$scope.projects && $scope.project) ? $.grep($scope.projects, function(project) {
        return project.id !== $scope.project.id;
      }) :  [];
    };

    $scope.currentUserCanCreateMission = function() {
      return CurrentSession.userCanDo('add', 'missions'/*, $scope.currentScope.id*/);
    };

    $scope.createMissionPopin = function() {
      var dialog,
          createMissionPopinScope = $rootScope.$new();

      createMissionPopinScope.createMission = function() {

        if (createMissionPopinScope.mission.deadline) {
          createMissionPopinScope.mission.deadline = moment(createMissionPopinScope.mission.deadline).toISOString();
        }

        $scope.project.missions.$create(createMissionPopinScope.mission).$then(function() {
          dialog.close();
        });
      };

      dialog = ngDialog.open({
        template  : 'views/app/missions/popins/create_mission_popin.html',
        scope     : createMissionPopinScope
      });
    };

  });
