/// <reference path='../_lobby.ts' />

module lobby.controllers {
  'use strict';

  class LobbyCtrl {

    private lobby;

    ctrlName: string

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      'lobbyStorage'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope, private lobbyStorage) {
      var lobbyData = lobbyStorage.getGames();

      this.ctrlName = 'LobbyCtrl';
    }

    public static getLobbyData(){

    }
  }


  /**
  * @ngdoc object
  * @name lobby.controller:LobbyCtrl
  *
  * @description
  *
  */
  angular
    .module('lobby')
    .controller('LobbyCtrl', LobbyCtrl);
}
