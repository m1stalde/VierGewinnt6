///<reference path='../../../typings/tsd.d.ts' />
module Game.Controllers {
  'use strict';

  class GameCtrl {

    ctrlName: string;
    gameFields: Array<any>;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$log'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $log : ng.ILogService) {
      this.ctrlName = 'GameCtrl';
      this.init();
    }

    init() {
      this.$log.debug("initializing game fields array");

      var gf = new Array();

      for (var row = 0; row < 6; row++) {
        gf[row] = new Array();

        for (var col = 0; col < 7; col++) {
          gf[row][col] = {
            name: row + "-" + col
          };
        }
      }

      this.gameFields = gf;
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
