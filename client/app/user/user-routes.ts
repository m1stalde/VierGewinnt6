///<reference path='../../typings/tsd.d.ts' />
module home {
  'use strict';

  angular
    .module('user')
    .config(config)

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/user', {
        templateUrl: 'user/views/user.tpl.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
      });
  }
}
