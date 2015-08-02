///<reference path='../../../typings/tsd.d.ts' />
///<reference path='../../../typings/angularjs/angular-resource.d.ts' />
module User.Services {
  'use strict';

  export interface IUserService {
    getCurrentUser() : ng.resource.IResource<IUser>;
    getCurrentUserAsync(callback);
    saveUser(user : IUser);
  }

  export interface IUserResource extends ng.resource.IResource<IUser> {
  }

  export interface IUser {
    name: string;
    password: string;
  }

  class UserService {

    private userResource : ng.resource.IResourceClass<ng.resource.IResource<IUser>>;

    public static $inject = [
      '$resource'
    ];

    constructor(private $resource:angular.resource.IResourceService) {
      this.userResource = $resource('http://localhost:2999/users');
    }

    getCurrentUser() : IUserResource {
      return this.userResource.get();
    }

    getCurrentUserAsync(callback) {
      var user = this.userResource.get(function() {
        if (callback) callback(user);
      });
    }

    saveUser(user : IUser) {
      this.userResource.save(user);
    }
  }

  /**
   * @ngdoc service
   * @name user.service:User
   *
   * @description
   *
   */
  angular
    .module('user')
    .service('UserService', UserService);
}
