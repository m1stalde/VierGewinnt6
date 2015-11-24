/*global element, by*/
'use strict';

function UserPage() {
  this.heading = element(by.tagName('h2'));

  this.open = function () {
    browser.get('/#/user');
  }
}

module.exports = UserPage;
