///<reference path='../typings/tsd.d.ts' />
module vierGewinnt6 {
  'use strict';

  angular
    .module('vierGewinnt6')
    .config(config)
    .run(init);

  function config($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });

    $httpProvider.defaults.withCredentials = true;
  }

  /**
   * Resolve load current session for each route and catch route change errors globally
   * @param $route
   * @param $rootScope
   * @param $location
   * @param LoggerService
   */
  function init($route: ng.route.IRouteService, $rootScope: ng.IScope, $location: ng.ILocationService, LoggerService: Common.Services.ILoggerService) {
    for (var r in $route.routes) {
      var route = $route.routes[r];
      route.resolve = route.resolve ? route.resolve : {};
      route.resolve['LoadCurrentSession'] = ['SessionService', function (sessionService:Session.Services.ISessionService) {
        return sessionService.loadCurrentSession();
      }];
    };

    $rootScope.$on("$routeChangeError", function(evt, current, previous, rejection) {
      if (rejection && rejection.status && rejection.status === 401) {
        $location.path("/session"); // redirect to login screen on unauthorized error
      } else {
        LoggerService.warn('route change error', rejection);
      }
    });
  }
}
