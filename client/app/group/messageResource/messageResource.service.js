'use strict';

angular.module('myappApp')
.factory('messageResource', function ($resource) {
  return $resource('/api/messages/:id', {id: '@id', groupId: '@groupId'},  {
    query: {
      method: 'GET',
      url: '/api/messages/:groupId/messages',
      isArray: true
    }
  });
});
