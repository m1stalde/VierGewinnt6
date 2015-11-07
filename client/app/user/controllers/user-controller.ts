///<reference path='../../../typings/tsd.d.ts' />
module User.Controllers {
  'use strict';

  class UserCtrl {

    ctrlName: string;
    displayUser: User.Services.IUser;
    password: string;
    passwordCheck: string;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      'UserService', 'LoggerService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private userService: User.Services.IUserService, private log: Common.Services.ILoggerService) {
      this.displayUser = userService.getCurrentUser();
    }

    saveUser() {
      this.displayUser.password = this.password;
      var that = this;

      this.userService.saveUser(this.displayUser)
        .then(result => {
          that.log.info('Daten gespeichert', result);
        })
        .catch(err => {
          that.log.error('Speichern fehlgeschlagen', err);
        });
    }
  }


  /**
  * @ngdoc object
  * @name user.controller:UserCtrl
  *
  * @description
  *
  */
  angular
    .module('user')
    .controller('UserCtrl', UserCtrl);
}
