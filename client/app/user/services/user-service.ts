///<reference path='../../../typings/tsd.d.ts' />
///<reference path='../../../typings/angularjs/angular-resource.d.ts' />
module User.Services {
  'use strict';

  export interface IUserService {
    loadUserData() : ng.IPromise<IUser>;
    getCurrentUser() : IUser;
    saveUser(user : IUser);
  }

  export interface IUser {
    name: string;
    password: string;
  }

  class UserService {

    private userData : IUser;

    private userResource : ng.resource.IResourceClass<ng.resource.IResource<IUser>>;

    public static $inject = [
      '$resource', '$q'
    ];

    constructor(private $resource:angular.resource.IResourceService, private $q : ng.IQService) {
      this.userResource = $resource('http://localhost:2999/users');
    }

    loadUserData() : ng.IPromise<IUser> {
      var deferred = this.$q.defer();

      if (!this.userData) {
        this.userResource.get().$promise.then((user) => {
          this.userData = user;
          deferred.resolve(this.userData);
        });
      } else {
        deferred.resolve(this.userData);
      }

      return deferred.promise;
    }

    getCurrentUser() : IUser {
      return this.userData;
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
