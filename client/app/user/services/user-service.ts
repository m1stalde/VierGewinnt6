///<reference path='../../../typings/tsd.d.ts' />
///<reference path='../../../typings/angularjs/angular-resource.d.ts' />
module User.Services {
  'use strict';

  export interface IUserService {
    loadUserData(): ng.IPromise<IUser>;
    getCurrentUser(): IUser;
    saveUser(user: IUser): ng.IPromise<IUser>;
  }

  export interface IUser {
    name: string;
    password: string;
  }

  class UserService {

    private userData : IUser;

    private userResource : ng.resource.IResourceClass<ng.resource.IResource<IUser>>;

    public static $inject = [
      '$resource', '$q', 'appConfig', 'LoggerService'
    ];

    constructor(private $resource: angular.resource.IResourceService, private $q: ng.IQService, private appConfig: vierGewinnt6.IAppConfig,
      private log: Common.Services.ILoggerService) {
      this.userResource = $resource(appConfig.baseUrl + '/users');
    }

    loadUserData(): ng.IPromise<IUser> {
      var deferred = this.$q.defer();

      if (!this.userData) {
        this.userResource.get().$promise
          .then(user => {
            this.userData = user;
            deferred.resolve(this.userData);
          })
          .catch(err => {
            deferred.reject(err);
          });
      } else {
        deferred.resolve(this.userData);
      }

      return deferred.promise;
    }

    getCurrentUser(): IUser {
      return this.userData;
    }

    saveUser(user: IUser): ng.IPromise<IUser> {
      this.userData = user;
      return this.userResource.save(user).$promise;
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
