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

  interface IGameResource extends ng.resource.IResourceClass<ng.resource.IResource<IGame>> {
    create(): ng.resource.IResource<IGame>;
    move(any, IGame): ng.resource.IResource<IGame>;
    restart(IGame): ng.resource.IResource<IGame>;
    break(IGame): ng.resource.IResource<IGame>;
  }

  class GameService implements IGameService {

    private game: IGame;
    private gameId: string;

    private gameResource: IGameResource;

    public static $inject = [
      '$resource', '$q', 'LoggerService', 'MessageService', 'appConfig'
    ];

    constructor(private $resource: angular.resource.IResourceService, private $q: ng.IQService, private log: Common.Services.ILoggerService, private messageService: Common.Services.IMessageService, private appConfig: vierGewinnt6.IAppConfig) {
      var that = this;
      var gameUrl = appConfig.baseUrl + '/game/:gameId';

      that.gameResource = <IGameResource>$resource(gameUrl,
        { gameId: '@_id' }, {
          create: { method: 'POST' },
          move: { method: 'POST', url: gameUrl + '/move/:col' },
          restart: { method: 'POST', url: gameUrl + '/restart' },
          break: { method: 'POST', url: gameUrl + '/break' }
        });

      // register for game update messages concerns to current game
      messageService.addMessageListener(GameUpdateMessage.NAME, function (message: GameUpdateMessage) {
        if (that.gameId === message.data._id) {
          that.log.debug('message reveiced ' + message);
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
        this.gameResource.create().$promise
          .then(data => {
            that.setGame(data);
            deferred.resolve(that.game);
          })
        .catch(err => {
            that.log.debug('new game failed', err);
            deferred.reject(err);
          });
      } else {
        deferred.resolve(that.game);
      }

      return deferred.promise;
    }

    loadGame(gameId: string): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      // load game if game id changed only
      if (that.gameId !== gameId) {
        this.gameResource.get({gameId:gameId}).$promise
          .then(data => {
            that.setGame(data);
            deferred.resolve(that.game);
          })
          .catch(err => {
            that.log.debug('load game failed', err);
            deferred.reject(err);
          });
      } else {
        deferred.resolve(that.game);
      }

      that.gameId = gameId;
      return deferred.promise;
    }

    doMove(col: number): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.gameResource.move({col:col}, this.game).$promise
        .then(data => {
          that.setGame(data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.debug('do move failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    restartGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.gameResource.restart(this.game).$promise
        .then(data => {
          that.setGame(data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.debug('restart game failed', err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    breakGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this;

      this.gameResource.break(this.game).$promise
        .then(data => {
          that.setGame(data);
          deferred.resolve(that.game);
        })
        .catch(err => {
          that.log.debug('break game failed', err);
          deferred.reject(err);
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
