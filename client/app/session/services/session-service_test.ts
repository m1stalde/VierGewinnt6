///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('LoginService', function () {
  var service;

  beforeEach(module('login'));

  beforeEach(inject(function (LoginService) {
    service = LoginService;
  }));

  it('should equal LoginService', function () {
    expect(service.get()).toEqual('LoginService');
  });

});
