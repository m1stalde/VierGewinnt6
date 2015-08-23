/// <reference path='../_lobby.ts' />

module lobby.services {
  "use strict";
  export class LobbyStorage {

    private gameStorage : Array<any>;
    private baseUrl : string = 'http://localhost:2999'; /*this.appConstant.baseUrl + '/lobby';*/

    public static $inject = [
      '$http',
      '$resource',
      'appConfig'
    ];

    constructor(private $http: ng.IHttpService, private $resource : ng.resource.IResourceService, private appConfig: vierGewinnt6.IAppConfig) {

    }

    public LobbyRoom() : ng.resource.IResourceClass<ng.resource.IResource<any>> {
      return this.$resource(this.appConfig.baseUrl + '/lobby/:id', {id: '@id' });
    }
  }
}

angular
  .module('lobby')
  .service('lobbyStorage', lobby.services.LobbyStorage)
