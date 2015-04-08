'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        resolve: {
          groups: function(groupResource) {
            return groupResource.query().$promise;
          }   
        }   
      })
      .state('group_new', {
        url: '/group/new',
        templateUrl: 'app/group/group_new.html',
        controller: function($scope, groupResource) {
          $scope.groupAdd = function(form) {
             console.log(form.name);
          }
        }
      });
  });
