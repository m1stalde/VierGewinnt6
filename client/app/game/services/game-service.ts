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
    gameId: string;
  }

  export enum Color {
    Empty = 0,
    Red = 1,
    Yellow = 2
  };

  class GameService implements IGameService {

    private game: IGame;

    private demoMode: boolean;

    public static $inject = [
      '$http', '$q', '$log'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $log: ng.ILogService) {
      this.demoMode = true;
    }

    getGame(): IGame {
      return this.game;
    }

    newGame(): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this; // TODO check that

      if (!this.game) {
        this.$http.post<IGame>('http://localhost:2999/game/newGame', null).then((data) => {
          that.game = data.data;
          deferred.resolve(that.game);
        });
      } else {
        deferred.resolve(that.game);
      }

      return deferred.promise;
    }

    doMove(col: number): ng.IPromise<IGame> {
      var deferred = this.$q.defer();
      var that = this; // TODO check that

      this.$http.post<IGame>('http://localhost:2999/game/doMove', { gameId: that.game.gameId, col: col }).then((data) => {
        that.game = data.data;
        deferred.resolve(that.game);
      });

      return deferred.promise;
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
