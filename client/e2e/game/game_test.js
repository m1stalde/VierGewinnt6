/*global describe, beforeEach, it, browser, expect */
'use strict';

var GamePagePo = require('./game.po');

describe('Game page', function () {
  var gamePage;

  beforeEach(function () {
    gamePage = new GamePagePo();
    browser.get('/#/game');
  });

  it('should say GameCtrl', function () {
    expect(gamePage.heading.getText()).toEqual('game');
    expect(gamePage.text.getText()).toEqual('GameCtrl');
  });
});
