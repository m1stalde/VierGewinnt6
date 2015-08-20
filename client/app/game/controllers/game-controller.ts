///<reference path='../../../typings/tsd.d.ts' />
module Game.Controllers {
  'use strict';

  class GameCtrl {

    ctrlName: string;
    gameFields : Game.Services.Color[][];

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$log', 'GameService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $log : ng.ILogService, private gameService : Game.Services.IGameService) {
      this.ctrlName = 'GameCtrl';
      this.init();
    }

    init() {
      this.$log.debug("initializing game fields array");
      this.gameService.newGame().then((game) => this.gameFields = game.cells, null, (game) => this.gameFields = game.cells);
      //this.gameService.getGame().then((game2) => this.gameFields = game2.cells);
    }

    doMove(evt : JQueryEventObject) : void {
      var col = $(evt.target).data('x');
      if (col != undefined) {
        this.$log.debug("do move " + col);
        this.gameService.doMove(col);
      }
    }
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
