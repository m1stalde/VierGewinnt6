///<reference path='../../../typings/tsd.d.ts' />
module Session.Controllers {
  'use strict';

  class SessionCtrl {

    ctrlName: string;

    username: string;
    password: string;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      'SessionService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private sessionService : Session.Services.ISessionService) {
      var vm = this;
      vm.ctrlName = 'SessionCtrl';
    }

    login() {
      this.sessionService.login(this.username, this.password);
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
