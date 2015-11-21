///<reference path='../../../typings/tsd.d.ts' />
module Common.Directives {
  'use strict';

  angular
    .module('common')
    .directive('mainMenu', mainMenu);

  function mainMenu(): ng.IDirective {
    return {
      restrict: 'E',
      controller: MainMenuCtrl,
      controllerAs: 'mainMenu',
      replace: true,
      templateUrl: 'common/directives/main-menu-directive.tpl.html',
      bindToController: true
    };
  }

  export class MainMenuCtrl {

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      'SessionService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private sessionService:Session.Services.ISessionService) {
    }

    isUserLoggedIn(): boolean {
      return this.sessionService.isLoggedIn();
    }

    getCurrentUsername(): string {
      var session = this.sessionService.getCurrentSession();
      return session ? session.username : null;
    }
  }
}
