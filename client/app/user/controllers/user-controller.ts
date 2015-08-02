///<reference path='../../../typings/tsd.d.ts' />
module User.Controllers {
  'use strict';

  class UserCtrl {

    ctrlName: string;
    //user: User.Services.IUserResource;
    displayUser: User.Services.IUser;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      'UserService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private userService : User.Services.IUserService) {
      this.ctrlName = 'UserCtrl';
      //this.user = userService.getCurrentUser();
      var me = this; // TODO: why is this necessary?
      userService.getCurrentUserAsync(function (user){
        me.displayUser = user;
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
