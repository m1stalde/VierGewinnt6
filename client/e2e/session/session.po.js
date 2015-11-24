/*global element, by*/
'use strict';

function SessionPage() {
  this.heading = element(by.tagName('h2'));

  this.open = function () {
    browser.get('/#/session');
  }

  this.fill = function (name, password) {
    element(by.model('session.username')).sendKeys(name);
    element(by.model('session.password')).sendKeys(password);
    console.log(element(by.model('session.username')).getText());
  }

  //this.submit = element(by.tagName('button')).click();

  this.submit = function() {
    element(by.buttonText('Login')).click();
  }

  this.loginMessage = element(by.binding('session.currentSession.username'));
}

module.exports = SessionPage;
