///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('Game', function () {
  var service;

  beforeEach(module('game'));

  beforeEach(inject(function (Game) {
    service = Game;
  }));

  it('should equal Game', function () {
    expect(service.get()).toEqual('Game');
  });

});
