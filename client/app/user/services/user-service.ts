///<reference path='../../../typings/tsd.d.ts' />
///<reference path='../../../typings/angularjs/angular-resource.d.ts' />
module User.Services {
  'use strict';

  export interface IUserService {
    getUser(id : string) : ng.resource.IResource<IUser>;
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
      this.userResource = $resource('http://localhost:2999/users/:userId', { userId: '@id' });
    }

    getUser(id : string) : IUserResource {
      return this.userResource.get({ userId: id });
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
