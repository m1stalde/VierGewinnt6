///<reference path='../../../typings/tsd.d.ts' />
module Game.Controllers {
  'use strict';

  class GameCtrl {

    gameFields : Game.Services.Color[][];

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$log', 'GameService', '$scope'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $log : ng.ILogService, private gameService : Game.Services.IGameService, private $scope: ng.IScope) {
      var that = this;
      that.updateGameData();

      $scope.$on('GameUpdateMessage', function (event: ng.IAngularEvent, message: any) {
        that.$log.info("message reveiced in controller " + event);
        that.$scope.$apply(function (scope: ng.IScope) {
          that.updateGameData();
        });
      });
    }

    updateGameData() {
      this.$log.debug("initializing game fields array");
      this.gameFields = this.gameService.getGame().cells;
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
