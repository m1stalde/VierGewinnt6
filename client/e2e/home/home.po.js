/*global element, by*/
'use strict';

function HomePage() {
  this.heading = element(by.tagName('h2'));

  this.open = function () {
    browser.get('/#/home');
  }
}

module.exports = HomePage;
