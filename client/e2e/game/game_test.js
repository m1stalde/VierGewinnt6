/*global describe, beforeEach, it, browser, expect */
'use strict';

var GamePagePo = require('./game.po');

describe('Game page', function () {
  var gamePage;

  beforeEach(function () {
    gamePage = new GamePagePo();
    browser.get('/#/game');
  });

  it('should say game', function () {
    expect(gamePage.heading.getText()).toEqual('Spiel');
  });
});
