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
      baseUrlPattern: 'http://{host}:2999',
      baseWsUrlPattern: 'ws://{host}:2999'
    });

  export interface IAppConfig {
    baseUrlPattern: string;
    baseWsUrlPattern: string;
  }
}
