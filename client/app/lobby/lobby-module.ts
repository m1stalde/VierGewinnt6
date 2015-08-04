///<reference path='../../typings/tsd.d.ts' />
module lobby {
  'use strict';

  /* @ngdoc object
  * @name lobby
  * @description
  *
  */
  angular
    .module('lobby', [
      'ngRoute'
    ]).service('lobbyStorage', lobby.services.LobbyStorage);
}
