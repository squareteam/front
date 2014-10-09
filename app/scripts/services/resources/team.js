'use strict';

angular.module('squareteam.resources')
  .factory('TeamResource', function($resource, $http, $q, restmod) {
    var model = restmod.model('apis://teams', {
      users : { hasMany : restmod.model(null) },
      color : {
        init : '#2cc1ff'
      }
    }, 'AclModel');

    model.colors = [
      '#2cc1ff',
      '#ffeca0',
      '#a4f8e2',
      '#ffb9bc',
      '#f0c0eb',
      '#b7c9d1'
    ];

    return model;
  });

