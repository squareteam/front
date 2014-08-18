/* global $ */

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
    $scope.filter         = {};

    $scope.isFiltered = function() {
      return Object.keys($scope.filter).length;
    };

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

    $scope.changeOrganization = function(organization) {
      $scope.organization = organization;
      $scope.loadProjects();
    };

    // INIT

    CurrentSession.getOrganizations().then(function(_organizations) {
      $scope.organizations = _organizations;

      // Load projects at startup
      $scope.loadProjects();
    });

    $scope.$on('project:delete', function(_, projectId) {
      var index = -1;
      angular.forEach($scope.projects, function(project, i) {
        if (project.id === projectId) {
          index = i;
        }
      });

      if (index >= 0) {
        $scope.projects.splice(index, 1);
      }
    });

    // TO MOVE IN A DIRECTIVE + SERVICE (stDropdownFilters)

    $scope.clearFilters = function() {
      $('.filters .by_team .active_label, .filters .by_status .active_label').remove();
      $('.filters .by_team span, .filters .by_status span').show();
      $('.filters .by_team, .filters .by_status').removeClass('active').show();
      $('.filters .by_team , .filters .by_status').css('backgroundColor', '');

      $scope.filter      = {};
    };

    $('.status_filters li, .team_filters li').mouseover(function(e) {
      $(e.currentTarget).css('backgroundColor', $(e.currentTarget).data('color'));
    });

    $('.status_filters li, .team_filters li').mouseout(function(e) {
      $(e.currentTarget).css('backgroundColor', '');
    });


    function setSelectedLabel (node, text) {
      if (!node.find('.active_label').length) {
        node.find('span').hide();
        node.prepend('<span class="active_label"></span>');
      }
      node.find('.active_label').text(text);
      node.addClass('active');
    }

    $('.status_filters li').on('click', function(e) {
      setSelectedLabel($('.by_status'), $(e.currentTarget).text());

      $('.by_status').css('backgroundColor', $(e.currentTarget).data('color'));
    });

    $('.team_filters li').on('click', function(e) {
      
      setSelectedLabel($('.by_team'), $(e.currentTarget).text());

      $('.by_team').css('backgroundColor', $(e.currentTarget).data('color'));
    });

    $('.sort_filters li').on('click', function(e) {
      setSelectedLabel($('.sort'), $(e.currentTarget).text());

      $('.sort').removeClass('icon-sort-asc');
      $('.sort').removeClass('icon-sort-desc');
      $('.sort').addClass($(e.currentTarget).attr('class'));
    });


    // METHODS

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
