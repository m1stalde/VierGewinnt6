///<reference path='../../../typings/tsd.d.ts' />
module chat.controllers {
  'use strict';

  class ChatCtrl {

    public chatHistory : Array<IChatMessage> = [];
    public chatSection : string;
    public id : string; // Unique Identifier for a sub section in "chatSection" => e.g one chat for each pending game

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
      this.initChatModel();
    }

    public initChatModel() : void{
      this.$scope.chatModel = <IChatModel>{
        chatHistory: this.chatHistory,
        userService: this.userService,
        messageService: this.messageService,
        storeChatSectionDataInCtrl: this.storeChatSectionDataInCtrl,
        subscribeToChatSectionEvents: this.subscribeToChatSectionEvents,
        unsubscribeToChatSectionEvents: this.unsubscribeToChatSectionEvents,
        fetchChatHistory: this.fetchChatHistory,
        sendMessage: this.sendMessage,
        chatMessageListener: this.chatMessageListener
      }
    }

    public storeChatSectionDataInCtrl(section, id){
      // Store the section additionally to the directive in the controller
      this.chatSection = section
      this.id = id;
    }

    public subscribeToChatSectionEvents(section : string){
      var self = this;

      // Subscribe for the chat section for incoming messages
      this.messageService.addMessageListener(section + "ChatMessage", this.chatMessageListener(self));

      // Subscribe for incoming messages to load the chat history
      this.messageService.addMessageListener(section + "ChatHistory", function(message : ChatHistoryMessage){
        self.chatHistory = message.data.chatHistory;
      });
    }

    public chatMessageListener(self){
      return function(message : ChatInputMessage){
        self.chatHistory.push(message.data.chatMessageObj);
      }
    }

    public unsubscribeToChatSectionEvents(section : string, id : string){
      // Unsubscribe to the client side message service
      this.messageService.removeMessageListenerType(section + "ChatMessage");
      this.messageService.removeMessageListenerType(section + "ChatHistory");

      // Unsubscribe to the server side chat service
      var messageObj = new UnsubscribeToChatSectionMessage({
        chatSectionPrefix : section,
        id : id
      });
      this.messageService.sendMessage(messageObj);
    }

    // Send a chat message to the server
    public sendMessage(message : IChatMessage){
      var messageObj = new ChatInputMessage({
        chatSectionPrefix : this.chatSection,
        chatMessageObj : message,
        id : this.id
      });

      this.messageService.sendMessage(messageObj);
    }

    // Send a request for the chat history to the server
    public fetchChatHistory(section : string, id : string){
      var messageObj : ChatHistoryMessage = new ChatHistoryMessage({
        chatSectionPrefix : section,
        id : id,
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
    id : string;
    sendMessage : (message : IChatMessage) => void;
  }

  export interface IChatModel {
    chatHistory :  Array<Common.Services.IMessage>;
    userService: User.Services.IUserService;
    messageService : Common.Services.IMessageService;
    storeChatSectionDataInCtrl : (section : string, id : string) => void;
    subscribeToChatSectionEvents: (nameOfEventListener : string) => void;
    unsubscribeToChatSectionEvents: (nameOfEventListener : string, id : string) => void;
    fetchChatHistory : (section : string, id : string) => void;
    sendMessage : (message : IChatMessage) => void;
    chatMessageListener : (message : ChatInputMessage) => void
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

  /**
   * Message between services and server and clients.
   */
  export interface IMessage {

    /**
     * Type of the message.
     */
      type: string;

    /**
    * Further granularity in a given "type"
    */
      id? : string;

    /**
     * The message content.
     */
    data: any;
  }

  export class ClientMessage<T> implements IMessage {

    type:string;
    id: string;
    data:T;

    constructor(type:string, data:T, id? : string) {
      this.type = type;
      this.data = data;
      this.id = id;
    }
  }


  // Unsubscribe to a chat section
  export interface IChatUnsubscribe{
    chatSectionPrefix : string;
    id : string;
  }

  export class UnsubscribeToChatSectionMessage extends ClientMessage<IChatData> {
    static NAME = "ChatUnsubscribe";

    constructor (data: IChatUnsubscribe) {
      super(data.chatSectionPrefix + data.id + UnsubscribeToChatSectionMessage.NAME, data, data.id);
    }
  }

  // Send Messages
  export interface IChatData{
    chatSectionPrefix : string;
    id? : string;
    chatMessageObj : IChatMessage;
  }

  export class ChatInputMessage extends ClientMessage<IChatData> {
    static NAME = "ChatMessage";

    constructor (chatData: IChatData) {
      super(chatData.chatSectionPrefix + ChatInputMessage.NAME, chatData, chatData.id);
    }
  }

  // Chat history
  export interface IChatHistory{
    chatSectionPrefix : string;
    id? : string;
    chatHistory : Array<IChatMessage>;
  }

  export class ChatHistoryMessage extends ClientMessage<IChatHistory> {
    static NAME = "ChatHistory";

    constructor (chatData: IChatHistory) {
      super(chatData.chatSectionPrefix + ChatHistoryMessage.NAME, chatData, chatData.id);
    }
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
