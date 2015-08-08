///<reference path='../typings/tsd.d.ts' />
module vierGewinnt6 {
  'use strict';

  angular
    .module('vierGewinnt6')
    .config(config);

  function config($routeProvider: ng.route.IRouteProvider, $httpProvider : ng.IHttpProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });

    $httpProvider.defaults.withCredentials = true;
  }
}
