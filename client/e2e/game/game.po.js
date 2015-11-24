/*global element, by*/
'use strict';

function GamePage() {
  this.heading = element(by.tagName('h2'));

  this.open = function () {
    browser.get('/#/game');
  }

  this.gameContainer = element(by.className('game-container'));

  this.clickColumn = function (col) {
    var selector = '.move-play .game-field[data-x="' + col + '"]';
    $(selector).click();
  }
}

module.exports = GamePage;
