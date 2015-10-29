///<reference path='../../../typings/tsd.d.ts' />
module Game.Controllers {
  'use strict';

  class GameCtrl {

    private selectedMoveField = 3;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$log', 'GameService', '$scope', 'SessionService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $log: ng.ILogService, private gameService: Game.Services.IGameService, private $scope: ng.IScope, private sessionService: Session.Services.ISessionService) {
      var that = this;
    }

    getCurrentGame() {
      return this.gameService.getGame();
    }

    mouseOver(evt: JQueryEventObject): void {
      var col = $(evt.target).data('x');
      if (col != undefined) {
        this.selectedMoveField = col;
      }
    }

    doMove(evt: JQueryEventObject): void {
      var col = $(evt.target).data('x');
      if (col != undefined) {
        this.$log.debug("do move " + col);
        this.gameService.doMove(col);
      }
    }

    getMoveFields(): Game.Services.Color[] {
      var cells = new Array<Game.Services.Color>();
      var game = this.getCurrentGame();

      for (var row = 0; row < game.cells[0].length; row++) {
        if (row === this.selectedMoveField) {
          cells.push(game.nextColor);
        } else {
          cells.push(Game.Services.Color.Empty);
        }
      }

      return cells;
    }

    isCurrentUserOnMove(): boolean {
      var playerId = this.sessionService.getPlayerId();
      var nextPlayerId = this.getCurrentGame().nextPlayerId;
      return playerId === nextPlayerId;
    }

    isGameFinished(): boolean {
      return this.getCurrentGame().state === Game.Services.GameState.Finished;
    }

    isGameBroken(): boolean {
      return this.getCurrentGame().state === Game.Services.GameState.Broken;
    }

    getGameState(): IGameState {
      var gameState: IGameState;

      if (this.isGameFinished()) {
        if (this.isCurrentUserOnMove()) {
          gameState = {
            state: "won",
            message: "Spiel gewonnen!"
          };
        } else {
          gameState = {
            state: "loose",
            message: "Spiel verloren!"
          };
        }
      } else if (this.isGameBroken()) {
        gameState = {
          state: "broken",
          message: "Spiel beendet!"
        };
      } else {
        if (this.isCurrentUserOnMove()) {
          gameState = {
            state: "play",
            message: "Zug ausführen!"
          };
        } else {
          gameState = {
            state: "wait",
            message: "Zug abwarten!"
          };
        }
      }

      return gameState;
    }

    restartGame(): void {
      this.$log.debug("restart game");
      this.gameService.restartGame();
    }

    breakGame(): void {
      this.$log.debug("break game");
      this.gameService.breakGame();
    }
  }

  export interface IGameState {
    state: string;
    message: string;
  }

  /**
  * @ngdoc object
  * @name game.controller:GameCtrl
  *
  * @description
  *
  */
  angular
    .module('game')
    .controller('GameCtrl', GameCtrl);
}
