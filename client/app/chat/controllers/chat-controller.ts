///<reference path='../../../typings/tsd.d.ts' />
module chat.controllers {
  'use strict';

  class ChatCtrl {

    public chatHistory : Array<Common.Services.IMessage> = [];
    public chatSection : string;

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
        storeChatSectionInCtrl : this.storeChatSectionInCtrl,
        subscribeToChatSectionEvents : this.subscribeToChatSectionEvents,
        fetchChatHistory : this.fetchChatHistory
      }
    }

    public storeChatSectionInCtrl(section){
      // Store the section additionally to the directive in the controller
      this.chatSection = section;
    }

    public subscribeToChatSectionEvents(nameOfEventListener : string){

      // Subscribe for the chat section for incoming messages
      this.messageService.addMessageListener(nameOfEventListener, this.messageServiceCb)

      // Subscribe for incoming messages to load the chat history
      var eventListener = this.chatSection + "ChatHistory";
      this.messageService.addMessageListener(eventListener, this.messageServiceCb)
    }

    public messageServiceCb(message : Common.Services.IMessage){
      // Update a field => gets binded to the directory
    }

    public fetchChatHistory(){
      var messageObj : ChatHistoryMessage = new ChatHistoryMessage({
        chatSectionPrefix : this.chatSection,
        chatHistory : null
      })

      // Send a request in order to retrieve the chat history of the given section
      this.messageService.sendMessage(messageObj);
    }
  }

  export interface IChatScope extends ng.IScope {
    getTemplateUrl : () => string;
    chatModel : IChatModel;
    chatSection : string;
  }

  export interface IChatModel {
    chatHistory :  Array<Common.Services.IMessage>;
    userService: User.Services.IUserService;
    messageService : Common.Services.IMessageService;
    storeChatSectionInCtrl : (section : string) => void;
    subscribeToChatSectionEvents: (nameOfEventListener : string) => void;
    fetchChatHistory : () => void;
  }

  // Message
  export interface IChatMessage {
    message : string;
    creationDate : string;
    from : string;
    to : string;
  }

  export class ChatHistoryMessage extends Common.Services.ClientMessage<IChatHistory> {
    static NAME = "ChatHistory";

    constructor (chatData: IChatHistory) {
      super(chatData.chatSectionPrefix + ChatHistoryMessage.NAME, chatData);
    }
  }

  export interface IChatHistory{
    chatSectionPrefix : string;
    chatHistory : Array<IChatMessage>;
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
