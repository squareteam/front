'use strict';

angular.module('squareteam.resources')
  .factory('ProjectResource', function(restmod, ProjectResourceConfig, moment) {
    return restmod.model({
      url      : 'apis://projects',
      name     : 'projects'
    }, 'AclModel', ProjectResourceConfig, function() {
      this.on('after-feed', function() {
        this.progressAsNumber = parseInt(this.progress, 10);
        this.remainingDays = moment().diff(moment(this.deadline), 'days');
        this.remainingMonths = moment().diff(moment(this.deadline), 'months');
      });
    });
  });