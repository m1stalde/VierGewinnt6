///<reference path='../../../typings/tsd.d.ts' />
module Common.Services {
  'use strict';

  export interface IConfigService {
    getServiceUrl(path: string): string;
    getWebsocketUrl(): string;
  }

  class ConfigService implements IConfigService {

    public static $inject = [
      'appConfig', '$location'
    ];

    constructor(private appConfig: vierGewinnt6.IAppConfig, private $location: ng.ILocationService) {
    }

    getServiceUrl(path: string): string {
      var baseUrl = this.appConfig.baseUrlPattern.replace('{host}', this.$location.host());
      return baseUrl + path;
    }

    getWebsocketUrl(): string {
      return this.appConfig.baseWsUrlPattern.replace('{host}', this.$location.host());
    }
  }

  /**
   * @ngdoc service
   * @name game.service:Game
   *
   * @description
   *
   */
  angular
    .module('common')
    .service('ConfigService', ConfigService);
}
