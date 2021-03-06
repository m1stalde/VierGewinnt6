/// <reference path='../_lobby.ts' />


module lobby.services {
  "use strict";
  export class LobbyStorage {

    public static $inject = [
      '$http',
      '$resource',
      'ConfigService',
      'MessageService',
      '$location'
    ];

    constructor(private $http: ng.IHttpService, private $resource : ng.resource.IResourceService, private configService: Common.Services.IConfigService, private messageService: Common.Services.IMessageService,
                private $location: ng.ILocationService) {

      // register for game update messages concerns to current game
      messageService.addMessageListener(RoomUpdateMessage.NAME, function (message: RoomUpdateMessage) {
        $location.path('/game/' + message.data.gameId);
      });
    }

    public LobbyRoom() : ng.resource.IResourceClass<ng.resource.IResource<any>> {
      return this.$resource(this.configService.getServiceUrl('/lobby/:id'), {id: '@id' });
    }


  }

  class RoomUpdateMessage implements Common.Services.IMessage {
    static NAME = "RoomUpdateMessage";
    type: string = RoomUpdateMessage.NAME;
    data: lobby.interfaces.Room;
  }
}

angular
  .module('lobby')
  .service('lobbyStorage', lobby.services.LobbyStorage)
