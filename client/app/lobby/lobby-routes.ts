///<reference path='../../typings/tsd.d.ts' />
module lobby {
  'use strict';

  angular
    .module('lobby')
    .config(config)

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/lobby', {
        templateUrl: 'lobby/views/lobby.tpl.html',
        controller: 'LobbyCtrl',
        controllerAs: 'lobby',
        resolve: {
          'LoadUserData': ['UserService', function (userService: User.Services.IUserService) {
            return userService.loadUserData();
          }]
        }
      });
  }
}
