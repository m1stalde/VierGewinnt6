/// <reference path='../_lobby.ts' />

module lobby.services {
  "use strict";
  export class LobbyService {

    public deferred = this.$q.defer();

    public static $inject = [
      '$q',
      '$log',
      'lobbyStorage'
    ];

    constructor(private $q: ng.IQService, private $log : ng.ILogService, private lobbyStorage) {}

  }
}

angular
  .module('lobby')
  .service('lobbyService', lobby.services.LobbyService)
