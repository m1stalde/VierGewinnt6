///<reference path='../../../typings/tsd.d.ts' />

/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('gameField', function () {
  var scope
    , element;

  beforeEach(module('game', 'game/directives/game-field-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<game-field></game-field>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$apply();
    expect(element.isolateScope().gameField.name).toEqual('gameField');
  });

});
