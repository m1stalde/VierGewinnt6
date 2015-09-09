///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('ChatCtrl', function () {
  var ctrl;

  beforeEach(module('chat'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('ChatCtrl');
  }));

  it('should have ctrlName as ChatCtrl', function () {
    expect(ctrl.ctrlName).toEqual('ChatCtrl');
  });

});
