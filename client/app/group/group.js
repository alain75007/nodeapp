'use strict';

angular.module('myappApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        resolve: {
          groups: function(groupResource, Auth) {
            var user = Auth.getCurrentUser();
            return groupResource.query({userId: user._id}).$promise;
          }   
        }   
      })
      .state('group_new', {
        url: '/group/new',
        templateUrl: 'app/group/group_new.html',
        controller: function($scope, $state, Auth, groupResource) {
          $scope.user = Auth.getCurrentUser();
          $scope.groupAdd = function(form) {
             groupResource.save({userId: $scope.user._id, name: form.name, _creator: $scope.user._id, emails: form.emails}).$promise
             .then(function() {
               $state.go('group');
               //debugger;
             });
          };
        }
      });
  });
