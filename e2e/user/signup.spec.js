'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/signup');
    page = require('./signup.po');
  });

  it('should include jumbotron with correct data', function() {
    //console.log(page.form);
    page.name.sendKeys('Alain');
    page.email.sendKeys('alain@itipic.com');
    page.password.sendKeys('password');
    page.goButton.click().then(function() {
         browser.waitForAngular();
         console.log('kkkkk ' + browser.getLocationAbsUrl());
         expect(browser.getLocationAbsUrl()).toBe('/');
         //expect($("#create-account-success").isDisplayed()).toBeTruthy();
    });
    //expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
   // expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    //expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });
});
