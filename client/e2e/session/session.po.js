/*global element, by*/
'use strict';

function SessionPage() {
  this.heading = element(by.tagName('h2'));
  /*this.open = browser.get('/#/session');

  this.fill = function (name, password) {
    element(by.model('username')).sendKeys(name);
    element(by.model('password')).sendKeys(password);
  }

  this.submit = element(by.tagName('button')).click();*/
}

module.exports = SessionPage;
