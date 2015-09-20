///<reference path='../typings/tsd.d.ts' />
module vierGewinnt6 {
  'use strict';

  angular
    .module('vierGewinnt6')
    .config(config)
    .run(init);

  function config($routeProvider: ng.route.IRouteProvider, $httpProvider : ng.IHttpProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });

    $httpProvider.defaults.withCredentials = true;
  }

  /**
   * Resolve load current session for each route.
   * @param $route
   */
  function init($route: ng.route.IRouteService) {
    for (var r in $route.routes) {
      var route = $route.routes[r];
      route.resolve = route.resolve ? route.resolve : {};
      route.resolve['LoadCurrentSession'] = ['SessionService', function (sessionService:Session.Services.ISessionService) {
        return sessionService.loadCurrentSession();
      }];
    };
  }
}
