///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('GameCtrl', function () {
  var ctrl;

  beforeEach(module('game'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('GameCtrl');
  }));

  it('should have ctrlName as GameCtrl', function () {
    expect(ctrl.ctrlName).toEqual('GameCtrl');
  });

});
