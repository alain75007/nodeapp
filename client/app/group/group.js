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
        controller: function($scope, $state, groupResource) {
          $scope.groupAdd = function(form) {
             groupResource.save({name: form.name, emails: form.emails}).$promise
             .then(function() {
               $state.go('group');
               //debugger;
             });
          };
        }
      })
      .state('group_show', {
        url: '/group/:groupId',
        templateUrl: 'app/group/group_show.html',
        controller: function($scope, $state, group) {
          $scope.group = group;
        },
        resolve: {
          group: function(groupResource, $stateParams) {
            console.log('group_id ' + $stateParams.groupId);
            return groupResource.get({id: $stateParams.groupId}).$promise;
          }   
        }   
      });
  });
