///<reference path='../../../typings/tsd.d.ts' />



module chat.controllers {
  'use strict';

  class ChatCtrl {

    public chatHistory : Array<Common.Services.IMessage> = [];
    public chatSection : string;
    public currentMessage : string;

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
        fetchChatHistory : this.fetchChatHistory,
        sendMessage : this.sendMessage
      }
    }

    public storeChatSectionInCtrl(section){
      // Store the section additionally to the directive in the controller
      this.chatSection = section;
    }

    public subscribeToChatSectionEvents(section : string){
      var self = this;

      // Subscribe for the chat section for incoming messages
      this.messageService.addMessageListener(section + "ChatMessage", function(message : ChatInputMessage){
        var k = 4;
      });

      // Subscribe for incoming messages to load the chat history
      this.messageService.addMessageListener(section + "ChatHistory", function(message : ChatHistoryMessage){
        self.chatHistory = message.data.chatHistory;
      });
    }

    // Send a chat message to the server
    public sendMessage(message : string){
      var messageObj = new ChatInputMessage({
        chatSectionPrefix : this.chatSection,
        chatMessageObj : new ChatMessage({
          message : message
        })
      });

      this.messageService.sendMessage(messageObj);
    }

    // Send a request for the chat history to the server
    public fetchChatHistory(section : string){
      var messageObj : ChatHistoryMessage = new ChatHistoryMessage({
       chatSectionPrefix : section,
       chatHistory : null
       });

       // Send a request in order to retrieve the chat history of the given section
       this.messageService.sendMessage(messageObj);
    }
  }

  export interface IChatScope extends ng.IScope {
    getTemplateUrl : () => string;
    chatModel : IChatModel;
    chatSection : string;
    sendMessage : (message : string) => void;
  }

  export interface IChatModel {
    chatHistory :  Array<Common.Services.IMessage>;
    userService: User.Services.IUserService;
    messageService : Common.Services.IMessageService;
    storeChatSectionInCtrl : (section : string) => void;
    subscribeToChatSectionEvents: (nameOfEventListener : string) => void;
    fetchChatHistory : (section: string) => void;
    sendMessage : (message : string) => void;
  }

  // Message
  export interface IChatMessage {
    message : string;
    creationDate? : string;
    from? : string;
    to? : string;
  }

  export class ChatMessage implements IChatMessage {
    public message : string;
    public creationDate : string;
    public from : string;
    public to : string;

    constructor(message : IChatMessage){
      this.message = message.message;
      this.creationDate = message.creationDate;
      this.from = message.from;
      this.to = message.to;
    }
  };

  // Message Service
  export interface IChatData{
    chatSectionPrefix : string;
    chatMessageObj : IChatMessage;
  }

  export class ChatInputMessage extends Common.Services.ClientMessage<IChatData> {
    static NAME = "ChatMessage";

    constructor (chatData: IChatData) {
      super(chatData.chatSectionPrefix + ChatInputMessage.NAME, chatData);
    }
  }

  // Chat history
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
