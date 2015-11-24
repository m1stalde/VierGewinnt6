/*global describe, beforeEach, it, browser, expect */
'use strict';

var GamePagePo = require('./game.po');

describe('Game page', function () {
  var gamePage;

  beforeEach(function () {
    gamePage = new GamePagePo();
    gamePage.open();
  });

  it('should say game', function () {
    expect(gamePage.heading.getText()).toEqual('Spiel');
  });

  it('should fill up', function () {
    // fill up all game fields
    for (var col = 0; col < 7; col++) {
      var cnt = 6 - (col % 2);
      for (var row = 0; row < cnt; row++) {
        gamePage.clickColumn(col);
      }
    }
    for (var col = 1; col < 6; col+=2) {
      gamePage.clickColumn(col);
    }

    // check for 21 red and 21 yellow fields
    gamePage.gameContainer.all(by.css('.game-field.red')).then(function(items) {
      console.log('### ' + items.length);
      expect(items.length).toBe(21);
    });
    gamePage.gameContainer.all(by.css('.game-field.yellow')).then(function(items) {
      console.log('*** ' + items.length);
      expect(items.length).toBe(21);
    });
  })
});
