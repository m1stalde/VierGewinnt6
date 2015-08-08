///<reference path='../../typings/tsd.d.ts' />
module session {
  'use strict';

  angular
    .module('session')
    .config(config)

  function config($routeProvider: ng.route.IRouteProvider) {
    $routeProvider
      .when('/session', {
        templateUrl: 'session/views/session.tpl.html',
        controller: 'SessionCtrl',
        controllerAs: 'session'
      });
  }
}
