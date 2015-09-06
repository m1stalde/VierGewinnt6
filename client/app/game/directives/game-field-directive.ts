///<reference path='../../../typings/tsd.d.ts' />
module GameField {
  'use strict';

  /**
  * @ngdoc directive
  * @name game.directive:gameField
  * @restrict EA
  * @element
  *
  * @description
  *
  * @example
    <example module="game">
      <file name="index.html">
        <game-field></game-field>
      </file>
    </example>
  *
  */
  angular
    .module('game')
    .directive('gameField', gameField);

  function gameField(): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'game/directives/game-field-directive.tpl.html'
    };
  }
}
