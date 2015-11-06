///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame(): IGame;
    getGameId(): string;
    newGame(): ng.IPromise<IGame>;
    loadGame(gameId: string): ng.IPromise<IGame>;
    doMove(col: number): ng.IPromise<IGame>;
    restartGame(): ng.IPromise<IGame>;
    breakGame(): ng.IPromise<IGame>;
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
    private gameId: string;

    public static $inject = [
      '$http', '$q', 'LoggerService', 'MessageService', 'appConfig'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private log: Common.Services.ILoggerService, private messageService: Common.Services.IMessageService, private appConfig: vierGewinnt6.IAppConfig) {
      var that = this;

      // register for game update messages concerns to current game
      messageService.addMessageListener(GameUpdateMessage.NAME, function (message: GameUpdateMessage) {
        if (that.gameId === message.data._id) {
          that.log.debug("message reveiced " + message);
          that.setGame(message.data);
        }
      });
    }

    getGame(): IGame {
      return this.game;
    }

    getGameId(): string {
      return this.gameId;
    }

    newGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      if (!this.game) {
        this.$http.post<IGame>(this.appConfig.baseUrl + '/game/newGame', null).then((data) => {
          that.setGame(data.data);
          deferred.resolve(that.game);
        });
      } else {
        deferred.resolve(that.game);
      }

      return deferred.promise;
    }

    loadGame(gameId: string): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;
      that.gameId = gameId;

      if (!this.game) {
        this.$http.get<IGame>(this.appConfig.baseUrl + '/game/getGame', { params: { gameId: gameId }})
          .then(data => {
            that.setGame(data.data);
            deferred.resolve(that.game);
          })
          .catch(err => {
            that.log.error('Verbindungsfehler', err);
          });
      } else {
        deferred.resolve(that.game);
      }

      return deferred.promise;
    }

    doMove(col: number): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/doMove', { gameId: that.gameId, col: col })
        .then(data => {
          that.setGame(data.data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.error('Verbindungsfehler', err);
        });

      return deferred.promise;
    }

    restartGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/restartGame', {gameId: that.gameId})
        .then(data => {
          that.setGame(data.data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.error('Verbindungsfehler', err);
        });

      return deferred.promise;
    }

    breakGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/breakGame', { gameId: that.gameId })
        .then(data => {
          that.setGame(data.data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.error('Verbindungsfehler', err);
        });

      return deferred.promise;
    }

    private setGame(game: IGame) {
      this.game = game;
      this.gameId = game._id;
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
