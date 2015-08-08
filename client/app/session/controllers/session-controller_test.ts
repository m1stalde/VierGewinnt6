///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('SessionCtrl', function () {
  var ctrl;

  beforeEach(module('session'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('SessionCtrl');
  }));

  it('should have ctrlName as SessionCtrl', function () {
    expect(ctrl.ctrlName).toEqual('SessionCtrl');
  });

});
