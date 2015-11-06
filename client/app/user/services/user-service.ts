///<reference path='../../../typings/tsd.d.ts' />
///<reference path='../../../typings/angularjs/angular-resource.d.ts' />
module User.Services {
  'use strict';

  export interface IUserService {
    loadUserData(): ng.IPromise<IUser>;
    getCurrentUser(): IUser;
    saveUser(user: IUser);
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
      var that = this;

      if (!this.userData) {
        that.userResource.get().$promise
          .then(user => {
            that.userData = user;
            deferred.resolve(that.userData);
          })
          .catch(err => {
            that.log.error('Verbindungsfehler', err);
          });
      } else {
        deferred.resolve(that.userData);
      }

      return deferred.promise;
    }

    getCurrentUser(): IUser {
      return this.userData;
    }

    saveUser(user: IUser) {
      var that = this;

      this.userResource.save(user).$promise
        .then(res => {
          that.log.info('Daten gespeichert');
        })
        .catch(err => {
          that.log.error('Verbindungsfehler', err);
        });
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
