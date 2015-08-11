///<reference path='../../../typings/tsd.d.ts' />
module Game.Services {
  'use strict';

  export interface IGameService {
    getGame() : IGame;
    initGame() : ng.IPromise<IGame>;
    doMove(col : number) : void;
  }

  export interface IGame {
    cells : Cell[][];
  }

  export enum Cell {
    Empty = 0,
    Red = 1,
    Yellow = 2
  };

  class GameImpl implements IGame {

    public cells : Cell[][];

  }

  class GameService implements IGameService {

    private game : GameImpl;

    private demoMode : boolean;

    public static $inject = [
      '$resource', '$q', '$log'
    ];

    constructor(private $http : ng.IHttpService, private $q : ng.IQService, private $log : ng.ILogService) {
      this.demoMode = true;
    }

    getGame() : IGame {
      return this.game;
    }

    initGame() : ng.IPromise<IGame> {
      var deferred = this.$q.defer();

      if (this.demoMode) {
        var cells:number[][] = new Array(6);
        for (var y : number = 0; y < 6; y++) {
          cells[y] = new Array(7);
          for (var x : number = 0; x < 7; x++) {
            this.$log.debug("initializing game array cell " + x + "-" + y);
            cells[y][x] = Cell.Empty;
          }
        }
        cells[5][0] = Cell.Yellow;
        this.game = new GameImpl();
        this.game.cells = cells;
        deferred.resolve(this.game);
        return deferred.promise;
      }

      this.$http.get('http://localhost:2999/game/initGame').then((cells : Cell[][]) => {
        this.game = new GameImpl();
        this.game.cells = cells;
        deferred.resolve(this.game);
      });

      return deferred.promise;
    }

    doMove(col : number) : void {
      if (this.demoMode) {
        this.game.cells[5][col] = Cell.Red;
        return;
      }

      this.$http.post('http://localhost:2999/game/doMove', col);
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
