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
      .state('group_messages', {
        url: '/group/:groupId/messages',
        templateUrl: 'app/group/group_show.html',
        controller: function($scope, $state, socket, group, messageResource, messages) {
          $scope.group = group;
          $scope.messages = messages; 
          var tag = '/groups/'+ group._id + '/messages';
          console.log('syncUpdates ' + tag);
          socket.syncUpdates(tag, $scope.messages);
          $scope.messageAdd = function(form) {
            messageResource.save({
              group: $scope.group._id,
              content: form.content }
            ).$promise
            .then(function() {
              form.content = null;
              //debugger;
            });
          };
          $scope.$on('$destroy', function () {
            socket.unsyncUpdates(tag);
          });
        },
        resolve: {
          group: function(groupResource, $stateParams) {
            console.log('group_id ' + $stateParams.groupId);
            return groupResource.get({id: $stateParams.groupId}).$promise;
          },
          messages: function(groupResource, $stateParams) {
            console.log('group_id ' + $stateParams.groupId);
            return groupResource.messages({id: $stateParams.groupId}).$promise;
          }   
        }   
      });
  });
