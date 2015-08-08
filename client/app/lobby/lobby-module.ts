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
      'ngRoute',
      'ngResource'
    ])
    .service('lobbyStorage', lobby.services.LobbyStorage)
    .directive('stopEvent', lobby.directives.StopEvent.factory());
    /*.factory("resourceBuilder", ['$resource', ($resource) => new lobby.factories.ResourceBuilder($resource)])
    .factory("roomResource", ["ResourceBuilder", (builder: lobby.factories.ResourceBuilder) => builder.getRoomResource()]);*/
  /* .constant('appConstant', lobby.constants.Constants.Default);*/
}
