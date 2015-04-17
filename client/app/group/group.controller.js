'use strict';

angular.module('myappApp')
  .controller('GroupCtrl', function ($scope, groups, socket, Auth) {
    $scope.message = 'Hello';
    $scope.groups = groups;
    var user = Auth.getCurrentUser();
    var tag = 'group_'+user._id;
    socket.syncUpdates(tag, $scope.groups);
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates(tag);
    });
  });
