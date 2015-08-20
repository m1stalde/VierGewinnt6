///<reference path='../../typings/tsd.d.ts' />
module game {
  'use strict';

  angular
    .module('game')
    .config(config)

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/game', {
        templateUrl: 'game/views/game.tpl.html',
        controller: 'GameCtrl',
        controllerAs: 'game'/*,
        resolve: {
          'Something': ['GameService', function (gameService: Game.Services.IGameService) {
            return gameService.newGame();
          }]
        }*/
      });
  }
}
