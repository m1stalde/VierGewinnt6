///<reference path='../../../typings/tsd.d.ts' />
module Session.Services {
  'use strict';

  export interface ISessionService {
    login(username: string, password: string): ng.IPromise<ISession>;
    logout(): ng.IPromise<ISession>;
    isLoggedIn(): boolean;
    getCurrentSession(): ISession;
    loadCurrentSession(): ISession;
    getPlayerId(): string;
  }

  export interface ISession {
    playerId: string;
    username: string;
    loggedId: boolean;
  }

  class SessionService {

    private currentSession : ISession;

    public static $inject = [
      '$http', '$q', 'appConfig', '$log'
    ];

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private appConfig: vierGewinnt6.IAppConfig, private $log: ng.ILogService) {
    }

    login(username: string, password: string) : ng.IPromise<ISession> {
      var deferred = this.$q.defer();
      var that = this;

      this.$http.post<ISession>(this.appConfig.baseUrl + '/session/login', { "username":username, "password":password}).then((data) => {
        that.setCurrentSession(data.data);
        deferred.resolve(that.currentSession);
      });

      return deferred.promise;
    }

    logout(): ng.IPromise<ISession> {
      var deferred = this.$q.defer();
      var that = this;

      this.$http.post<ISession>(this.appConfig.baseUrl + '/session/logout', {}).then((data) => {
        that.setCurrentSession(data.data);
        deferred.resolve(that.currentSession);
      });

      return deferred.promise;
    }

    isLoggedIn() {
      return this.currentSession && this.currentSession.loggedId;
    }

    getCurrentSession(): ISession {
      return this.currentSession;
    }

    loadCurrentSession(): ng.IPromise<ISession> {
      var deferred = this.$q.defer();
      var that = this;

      if (!that.currentSession) {
        this.$http.get<ISession>(this.appConfig.baseUrl + '/session/').then((data) => {
          that.setCurrentSession(data.data);
          deferred.resolve(that.currentSession);
        });
      } else {
        deferred.resolve(that.currentSession);
      }

      return deferred.promise;
    }

    getPlayerId(): string {
      return this.currentSession.playerId;
    }

    get(): string {
      return 'LoginService';
    }

    private setCurrentSession(session: ISession): void {
      this.currentSession = session;
      this.$log.info('current session set to playerId ' + this.currentSession.playerId + ' and ' + this.currentSession.username);
    }
  }

  /**
   * @ngdoc service
   * @name login.service:LoginService
   *
   * @description
   *
   */
  angular
    .module('session')
    .service('SessionService', SessionService);
}
