
///<reference path='../../typings/tsd.d.ts' />
module chat {
  'use strict';

  angular
    .module('chat')
    .config(config)

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/chat', {
        templateUrl: 'chat/views/chat.tpl.html',
        controller: 'ChatCtrl',
        controllerAs: 'chat',
        resolve: {
          'LoadUserData': ['UserService', function (userService: User.Services.IUserService) {
            return userService.loadUserData();
          }]
        }
      });
  }
}

