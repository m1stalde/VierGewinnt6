///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame() : IGame;
    newGame() : ng.IPromise<IGame>;
    doMove(col : number) : void;
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
    Finished = 2
  }

  class GameService implements IGameService {

    private game: IGame;

    public static $inject = [
      '$http', '$q', '$log', 'MessageService', 'appConfig'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $log: ng.ILogService, private messageService: Common.Services.IMessageService, private appConfig: vierGewinnt6.IAppConfig) {
      var that = this;

      messageService.addMessageListener(GameUpdateMessage.NAME, function (message: GameUpdateMessage) {
        that.$log.info("message reveiced " + message);
        that.game = message.data;
      });
    }

    getGame(): IGame {
      return this.game;
    }

    newGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this; // TODO check that

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
      var that = this; // TODO check that

      this.$http.post<IGame>(this.appConfig.baseUrl + '/game/doMove', { gameId: that.game._id, col: col });
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
