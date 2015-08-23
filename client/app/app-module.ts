///<reference path='../typings/tsd.d.ts' />
module vierGewinnt6 {
  'use strict';

  /* @ngdoc object
   * @name vierGewinnt6
   * @description
   *
   */
  angular
    .module('vierGewinnt6', [
      'ngRoute',
      'ngResource',
      'mgcrea.ngStrap',
      'home',
      'game',
      'lobby',
      'user',
      'session',
      'common'
    ])
    .constant('appConfig', {
      baseUrl: 'http://localhost:2999',
      baseWsUrl: 'ws://localhost:2999'
    })
  ;

  export interface IAppConfig {
    baseUrl: string;
    baseWsUrl: string;
  }
}
