'use strict';

describe('Directive: userAvatar', function () {

  // load the directive's module
  beforeEach(module('myappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should display avatar image', inject(function ($compile) {
    element = angular.element('<user-avatar email="alain@itipic.com"></user-avatar>');
    element = $compile(element)(scope);
    scope.$digest();

    expect(element.attr('src')).toBe('//gravatar.com/avatar/c3577dd0bea553f1443833509fc6a1a3?d=identicon');
  }));

  it('should display avatar image of 40px', inject(function ($compile) {
    element = angular.element('<user-avatar email="alain@itipic.com" size="40"></user-avatar>');
    element = $compile(element)(scope);
    scope.$digest();

    expect(element.attr('src')).toBe('//gravatar.com/avatar/c3577dd0bea553f1443833509fc6a1a3?d=identicon&s=40');
  }));
});
