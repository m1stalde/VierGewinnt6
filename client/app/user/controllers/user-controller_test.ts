///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('UserCtrl', function () {
  var ctrl;

  beforeEach(module('home'));

  beforeEach(inject(function ($rootScope, $controller) {
    ctrl = $controller('UserCtrl');
  }));

  it('should have ctrlName as UserCtrl', function () {
    expect(ctrl.ctrlName).toEqual('UserCtrl');
  });

});
