///<reference path='../../../typings/tsd.d.ts' />
module Session.Controllers {
  'use strict';

  class SessionCtrl {

    username: string;
    password: string;
    currentSession: Session.Services.ISession;
    userLoggedIn: boolean;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      'SessionService',
      'appConfig',
      'LoggerService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private sessionService : Session.Services.ISessionService, private appConfig: vierGewinnt6.IAppConfig, private log: Common.Services.ILoggerService) {
      this.currentSession = sessionService.getCurrentSession();
      this.userLoggedIn = this.currentSession.loggedId;
    }

    login() {
      var vm = this;
      this.sessionService.login(this.username, this.password)
        .then(session => {
          vm.currentSession = session;
          vm.userLoggedIn = session.loggedId;
        })
        .catch(err => {
          vm.log.error('Login fehlgeschlagen');
        });
    }

    logout() {
      var vm = this;
      this.sessionService.logout()
        .then(session => {
          vm.currentSession = session;
          vm.userLoggedIn = session.loggedId;
        })
        .catch(err => {
          vm.log.error('Logout fehlgeschlagen');
        });
    }
  }


  /**
  * @ngdoc object
  * @name login.controller:LoginCtrl
  *
  * @description
  *
  */
  angular
    .module('session')
    .controller('SessionCtrl', SessionCtrl);
}
