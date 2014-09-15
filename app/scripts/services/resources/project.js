'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function(restmod, ProjectResourceConfig, moment) {
    return restmod.model('apis://projects', {
      name     : 'projects',

      missions : { hasMany : 'ProjectMissionResource' },

      progressAsNumber  : { mask : true },
      remainingDays     : { mask : true },
      remainingMonths   : { mask : true },

      '~afterFeed' : function() {
        this.progressAsNumber = parseInt(this.progress, 10);
        this.remainingDays = moment().diff(moment(this.deadline), 'days');
        this.remainingMonths = moment().diff(moment(this.deadline), 'months');
      }

    }, 'AclModel', ProjectResourceConfig);
  });