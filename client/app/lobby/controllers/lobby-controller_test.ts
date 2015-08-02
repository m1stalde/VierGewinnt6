///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('LobbyCtrl', function () {
  var ctrl;

  beforeEach(module('lobby'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('LobbyCtrl');
  }));

  it('should have ctrlName as LobbyCtrl', function () {
    expect(ctrl.ctrlName).toEqual('LobbyCtrl');
  });

});
