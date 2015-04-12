'use strict';

describe('Service: messageResource', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var messageResource;
  beforeEach(inject(function (_messageResource_) {
    messageResource = _messageResource_;
  }));

  it('should do something', function () {
    expect(!!messageResource).toBe(true);
  });

});
