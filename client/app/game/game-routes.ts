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
        controllerAs: 'game',
        resolve: {
          newGame: ['GameService', 'SessionService', function (gameService: Game.Services.IGameService, sessionService: Session.Services.ISessionService) {
            return sessionService.loadCurrentSession().then(result => {
              return gameService.newGame()
            });
          }]
        }
      })
      .when('/game/:gameId', {
        templateUrl: 'game/views/game.tpl.html',
        controller: 'GameCtrl',
        controllerAs: 'game',
        resolve: {
          loadGame: ['GameService', '$route', function (gameService: Game.Services.IGameService, $route) {
            return gameService.loadGame($route.current.params.gameId);
          }]
        }
      });
  }
}
