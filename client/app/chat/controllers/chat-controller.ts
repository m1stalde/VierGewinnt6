///<reference path='../../../typings/tsd.d.ts' />
module chat.controllers {
  'use strict';

  class ChatCtrl {

    public chatHistory : Array<Common.Services.IMessage> = [];

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      'UserService',
      'MessageService'
    ];

    // dependencies are injected via AngularJS $injector
    constructor(private $scope: IChatScope, private userService : User.Services.IUserService, private messageService : Common.Services.IMessageService) {
      this.$scope.chatModel = {
        chatHistory: this.chatHistory,
        userService : this.userService,
        messageService: this.messageService,
        subscribeToChatSection : this.subscribeToChatSection,
      }
    }

    private subscribeToChatSection(section : string){
      // Subscribe for the chat section
      this.messageService.addMessageListener(section, this.messageServiceCb)
    }

    private messageServiceCb(message : Common.Services.IMessage){
      // Update a field => gets binded to the directory
    }
  }

  export interface IChatScope extends ng.IScope {
    chatModel : IChatModel;
    chatSection : string;
  }

  export interface IChatModel {
    chatHistory :  Array<Common.Services.IMessage>;
    userService: User.Services.IUserService;
    messageService : Common.Services.IMessageService;
    subscribeToChatSection(section : string) : void;
  }

  /**
  * @ngdoc object
  * @name chat.controller:ChatCtrl
  *
  * @description
  *
  */
  angular
    .module('chat')
    .controller('ChatCtrl', ChatCtrl);
}
