///<reference path='../../../typings/tsd.d.ts' />
module Game.Directives {
  'use strict';

  export class GameMove implements ng.IDirective {
    public restrict = 'E';
    //public scope = {};
    public replace = true;
    public templateUrl = 'game/directives/game-move-directive.tpl.html';

    link(scope: ng.IScope, element: JQuery, attrs: any) {
      console.log("link scope " + scope);
    }
  }

  angular
    .module('game')
    .directive('gameMove', () => new GameMove());
}
