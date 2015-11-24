/*global describe, beforeEach, it, browser, expect */
'use strict';

var HomePagePo = require('./home.po');

describe('Home page', function () {
  var homePage;

  beforeEach(function () {
    homePage = new HomePagePo();
    homePage.open();
  });

  it('should say welcome', function () {
    expect(homePage.heading.getText()).toEqual('Willkommen beim Vier Gewinnt der Gruppe 6');
  });
});
