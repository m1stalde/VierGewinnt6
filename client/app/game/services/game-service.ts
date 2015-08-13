///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame() : IGame;
    initGame() : ng.IPromise<IGame>;
    doMove(col : number) : void;
  }

  export interface IGame {
    id : string;
    cells : Color[][];
  }

  export enum Color {
    Empty = 0,
    Red = 1,
    Yellow = 2
  };

  class GameService implements IGameService {

    private game : IGame;

    private demoMode : boolean;

    public static $inject = [
      '$http', '$q', '$log'
    ];

    constructor(private $http : ng.IHttpService, private $q : ng.IQService, private $log : ng.ILogService) {
      this.demoMode = true;
    }

    getGame() : IGame {
      return this.game;
    }

    initGame() : ng.IPromise<IGame> {
      var deferred = this.$q.defer();

      if (!this.game) {
        this.$http.post('http://localhost:2999/game/initGame', null).then((data) => {
          this.game = <IGame> data.data;
          deferred.resolve(this.game);
        });
      } else {
        deferred.resolve(this.game);
      }

      return deferred.promise;
    }

    doMove(col : number) : ng.IPromise<IGame> {
      var deferred = this.$q.defer();
var me = this; // TODO why?

      this.$http.post('http://localhost:2999/game/doMove', { gameId : this.game.id, col : col }).then((data) => {
        me.game = <IGame> data.data;
        deferred.resolve(me.game);
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
