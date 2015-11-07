///<reference path='../../../typings/tsd.d.ts' />
module Common.Services {
  'use strict';

  export interface ILoggerService {
    /**
     * Displays error message to user and logs message as error.
     * @param message
     * @param details
     */
    error(message: string, ...details: any[]): void;

    /**
     * Displays warn message to user and logs message as warning.
     * @param message
     * @param details
     */
    warn(message: string, ...details: any[]): void;

    /**
     * Displays info message to user and logs message as info.
     * @param message
     * @param details
     */
    info(message: string, ...details: any[]): void;

    /**
     * Logs message as debug.
     * @param message
     * @param details
     */
    debug(message: string, ...details: any[]): void;
  }

  class LoggerService implements ILoggerService {

    public static $inject = [ '$log' ];

    constructor(private $log: ng.ILogService) {
      toastr.options.timeOut = 3000;
      toastr.options.showDuration = 1200;
      toastr.options.hideDuration = 500;
      toastr.options.positionClass = "toast-top-right";
      toastr.options.closeButton = true;
    }

    error(message: string, ...details: any[]): void {
      toastr.error(message);
      this.log("ERROR", message, details);
    }

    warn(message: string, ...details: any[]): void {
      toastr.warning(message);
      this.log("WARN ", message, details);
    }

    info(message: string, ...details: any[]): void {
      toastr.info(message);
      this.log("INFO ", message, details);
    }

    debug(message: string, ...details: any[]): void {
      this.log("DEBUG", message, details);
    }

    private log(level: string, message: string, ...details: any[]): void {
      this.$log.log(new Date().toISOString() + " " + level + " " + message + " " + details.join(' '));
    }
  }

  /**
   * @ngdoc service
   * @name common.service:LoggerService
   *
   * @description
   *
   */
  angular
    .module('common')
    .service('LoggerService', LoggerService);
}
