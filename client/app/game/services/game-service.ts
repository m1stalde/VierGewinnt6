///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame(): IGame;
    newGame(): ng.IPromise<IGame>;
    doMove(col: number): void;
    restartGame(): void;
    breakGame(): void;
  }

  export interface IGame {
    cells: Color[][];
    nextColor: Color;
    nextPlayerId: string;
    playerId1: string;
    playerId2: string;
    state: GameState;
    _id: string;
  }

  export enum Color {
    Empty = 0,
    Red = 1,
    Yellow = 2
  }

  export enum GameState {
    New = 0,
    Running = 1,
    Finished = 2,
    Broken = 3
  }

  class GameService implements IGameService {

    private game: IGame;

    public static $inject = [
      '$http', '$q', '$log', 'MessageService', 'appConfig'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $log: ng.ILogService, private messageService: Common.Services.IMessageService, private appConfig: vierGewinnt6.IAppConfig) {
      var that = this;

      // register for game update messages concerns to current game
      messageService.addMessageListener(GameUpdateMessage.NAME, function (message: GameUpdateMessage) {
        if (that.game && that.game._id === message.data._id) {
          that.$log.info("message reveiced " + message);
          that.game = message.data;
        }
      });
    }

    getGame(): IGame {
      return this.game;
    }

    newGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      if (!this.game) {
        this.$http.post<IGame>(this.appConfig.baseUrl + '/game/newGame', null).then((data) => {
          that.game = data.data;
          deferred.resolve(that.game);
        });
      } else {
        deferred.resolve(that.game);
      }

      return deferred.promise;
    }

    doMove(col: number): void {
      var gameId = this.game._id;
      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/doMove', { gameId: gameId, col: col });
    }

    restartGame(): void {
      var gameId = this.game._id;
      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/restartGame', { gameId: gameId });
    }

    breakGame(): void {
      var gameId = this.game._id;
      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/breakGame', { gameId: gameId });
    }
  }

  class GameUpdateMessage implements Common.Services.IMessage {
    static NAME = "GameUpdateMessage";
    type: string = GameUpdateMessage.NAME;
    data: IGame;
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
