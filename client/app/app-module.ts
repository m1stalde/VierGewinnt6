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
      'common',
      'chat'
    ])
    .constant('appConfig', {
      baseUrl: 'http://127.0.0.1:2999',
      baseWsUrl: 'ws://127.0.0.1:2999'
    });

  export interface IAppConfig {
    baseUrl: string;
    baseWsUrl: string;
  }
}
