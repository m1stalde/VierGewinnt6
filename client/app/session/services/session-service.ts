///<reference path='../../../typings/tsd.d.ts' />
module Session.Services {
  'use strict';

  export interface ISessionService {
    login(username : string, password : string) : ng.IPromise<ISession>;
    logout() : void;
    isLoggedIn() : boolean;
    getSession() : ISession;
  }

  export interface ISession {
    username: string;
  }

  class SessionService {

    private session : ISession;

    public static $inject = [
      '$http', '$q'
    ];

    constructor(private $http : ng.IHttpService, private $q : ng.IQService) {
    }

    login(username : string, password : string) : ng.IPromise<ISession> {
      var deferred = this.$q.defer();

      if (!this.session) {
        this.$http.post('http://localhost:2999/session/login', { "username":username, "password":password}).then((data) => {
          this.session = data.data;
          deferred.resolve(this.session);
        });
      } else {
        deferred.resolve(this.session);
      }

      return deferred.promise;
    }

    logout() {
      this.$http.get('http://localhost:2999/session/logout');
    }

    isLoggedIn() {
      return !!(this.session);
    }

    getSession() : ISession {
      return this.session;
    }

    get(): string {
      return 'LoginService';
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
