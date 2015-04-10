'use strict';

angular.module('myappApp')
  .controller('GroupCtrl', function ($scope, socket, Auth, groups) {
    $scope.message = 'Hello';
    $scope.groups = groups;
    var user = Auth.getCurrentUser();
    var tag = 'group_'+user._id;
    console.log('syncUpdates ' + tag);
    socket.syncUpdates(tag, $scope.groups);
  });
