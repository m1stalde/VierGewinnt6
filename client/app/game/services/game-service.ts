///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame() : ng.IPromise<IGame>;
    newGame() : ng.IPromise<IGame>;
    doMove(col : number) : void;
  }

  export interface IGame {
    cells: Color[][];
    nextColor: Color;
    gameId: string;
  }

  export enum Color {
    Empty = 0,
    Red = 1,
    Yellow = 2
  };

  class GameService implements IGameService {

    private game: IGame;

    private gameDeferred: ng.IDeferred<IGame>;

    public static $inject = [
      '$http', '$q', '$log', 'MessageService'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $log: ng.ILogService, private messageService: Common.Services.IMessageService) {
      var that = this;

      that.gameDeferred = <ng.IDeferred<IGame>> $q.defer();

      messageService.addMessageListener(GameUpdateMessage.NAME, function (message: GameUpdateMessage) {
        that.$log.info("message reveiced " + message);
        that.game = message.data.game;
        that.gameDeferred.notify(that.game); // TODO check deferred notify without resolve
      });
    }

    getGame(): ng.IPromise<IGame> {
      return this.gameDeferred.promise;
    }

    newGame(): ng.IPromise<IGame> {
      var that = this; // TODO check that

      if (!this.game) {
        this.$http.post<IGame>('http://localhost:2999/game/newGame', null).then((data) => {
          that.game = data.data;
          that.gameDeferred.notify(that.game);
        });
      } else {
        that.gameDeferred.notify(that.game);
      }

      return that.gameDeferred.promise;
    }

    doMove(col: number) {
      this.messageService.sendMessage(new GameDoMoveMessage(this.game.gameId, col));
    }
  }

  class GameDoMoveMessage implements Common.Services.IMessage {
    static NAME = "GameDoMoveMessage";
    type: string = GameDoMoveMessage.NAME;
    data: any;

    constructor(gameId: string, col: number) {
      this.data = {
        gameId: gameId,
        col: col
      };
    }
  }

  class GameUpdateMessage implements Common.Services.IMessage {
    static NAME = "GameUpdateMessage";
    type: string = GameUpdateMessage.NAME;
    data: any;

    constructor (game: IGame) {
      this.data = {
        game: game
      };
    }
  }

  /**
   * @ngdoc service
   * @name game.service:Game
   *
   * @description
   *
   */
  angular
    .module('game')
    .service('GameService', GameService);
}
