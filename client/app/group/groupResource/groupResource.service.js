'use strict';

angular.module('myappApp')
.factory('groupResource', function ($resource) {
  console.log('factory groupResource');
  return $resource('/api/groups/:id', {id: '@id'},  {
    messages: {
      method: 'GET',
      url: '/api/groups/:id/messages',
      isArray: true
    }
  });
});
