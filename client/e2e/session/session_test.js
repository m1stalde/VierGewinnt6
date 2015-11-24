/*global describe, beforeEach, it, browser, expect */
'use strict';

var SessionPagePo = require('./session.po');

describe('Session page', function () {
  var sessionPage;

  beforeEach(function () {
    sessionPage = new SessionPagePo();
    sessionPage.open();
  });

  it('should say login', function () {
    expect(sessionPage.heading.getText()).toEqual('Login');
  });

  it('should say welcome', function () {
    sessionPage.fill('bla', 'fasel');
    sessionPage.submit();
    expect(sessionPage.heading.getText()).toEqual('Login');
    expect(sessionPage.loginMessage.getText()).toEqual('Hallo bla!');
  });
});
