'use strict';

describe('Controller: GroupCtrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));
  beforeEach(module('socketMock'));
  beforeEach(module('ngResource'));

  angular.module('myappApp')
  .provider('groups', function () {
    this.$get = function() {
      return [{_id: '111', name: 'Group test 1'}, {_id: '222', name: 'Group test 2'}];
    };
  });


  var GroupCtrl, scope, Auth;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_Auth_,$controller, $rootScope) {
    Auth = _Auth_;
    Auth.getCurrentUser = function() { return {_id: 333}; };

    scope = $rootScope.$new();
    GroupCtrl = $controller('GroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(scope.groups.length).toBe(2);
    expect(scope.groups[0]._id).toBe('111');
  });
});
