'use strict';

describe('Service: groupResource', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var groupResource;
  beforeEach(inject(function (_groupResource_) {
    groupResource = _groupResource_;
  }));

  it('should do something', function () {
    expect(!!groupResource).toBe(true);
  });

});
