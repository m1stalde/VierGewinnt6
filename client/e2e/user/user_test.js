/*global describe, beforeEach, it, browser, expect */
'use strict';

var UserPagePo = require('./user.po');

describe('User page', function () {
  var userPage;

  beforeEach(function () {
    userPage = new UserPagePo();
    userPage.open();
  });

  it('should say setting', function () {
    expect(userPage.heading.getText()).toEqual('Einstellungen');
  });
});
