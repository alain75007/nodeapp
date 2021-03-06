'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/signup');
    page = require('./signup.po');
  });

  it('should display the home page', function() {
    page.name.sendKeys('Alain');
    page.email.sendKeys('alain@itipic.com');
    page.password.sendKeys('password');
    page.goButton.click().then(function() {
      browser.waitForAngular();
         expect(browser.getLocationAbsUrl()).toBe('/');
         expect(page.userName.getText()).toBe('Alain');
    });
  });
});
