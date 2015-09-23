///<reference path='../../../typings/tsd.d.ts' />
module Common.Services {
  'use strict';

  export interface IMessageService {
    addMessageListener(messageType:string, listener:(message:IMessage) => void);
    sendMessage(message:IMessage);
  }

  /**
   * Message between services and server and clients.
   */
  export interface IMessage {

    /**
     * Type of the message.
     */
      type: string;

    /**
     * The message content.
     */
      data: any;
  }

  export class ClientMessage<T> implements IMessage {

    type:string;
    data:T;

    constructor(type:string, data:T) {
      this.type = type;
      this.data = data;
    }
  }

  class MessageService implements IMessageService {

    private ws:WebSocket;

    private messageListeners:any = {};

    public static $inject = [
      '$log', '$rootScope', 'appConfig', '$http'
    ];

    constructor(private $log:ng.ILogService, private $rootScope:ng.IScope, private appConfig:vierGewinnt6.IAppConfig, private $http:ng.IHttpService) {
      $log.debug('trying to reach server ' + this.appConfig.baseUrl + ' before connecting websocket');
      var self = this;

      // Connect to the websocket server
      self.connect(appConfig.baseWsUrl);

      // connect server through http first to initialize session and get session cookie
      $http.get(this.appConfig.baseUrl + '/session');
    }

    private connect(baseWsUrl:string) {
      this.$log.debug('connecting websocket to ' + baseWsUrl);
      var self = this;

      this.ws = new WebSocket(baseWsUrl);

      this.ws.onmessage = (event) => self.onMessage(event);
      this.ws.onopen = (event) => self.onOpen(event);
      this.ws.onerror = (error) => self.onError(error);
    }

    public addMessageListener(messageType:string, listener:(message:IMessage) => void) {
      this.$log.debug("adding message listener " + listener + " for message type " + messageType);

      if (!this.messageListeners.hasOwnProperty(messageType)) {
        this.messageListeners[messageType] = new Array();
      }

      this.messageListeners[messageType].push(listener);
    }

    public sendMessage(message:IMessage) {
      if (this.ws.readyState != WebSocket.OPEN) {
        throw new Error('Not connected');
      }

      this.ws.send(JSON.stringify(message));
    }

    private onMessage(message:MessageEvent) {
      this.$log.info("message received: " + message);

      var recvMessage = JSON.parse(message.data);
      var messageType = recvMessage.type;

      // TODO remove mapping
      var notifyMessage:IMessage = {
        type: recvMessage.type,
        data: recvMessage.data,
      }

      if (this.messageListeners.hasOwnProperty(messageType)) {
        this.messageListeners[messageType].forEach((listener) => listener(notifyMessage));
      }

      // notify angular about data changes
      this.$rootScope.$digest();
    }

    private onOpen(message:Event) {
      this.$log.info("WebSocket Open: " + message);
    }

    private onError(error:ErrorEvent) {
      this.$log.info("WebSocket Error: " + error);
    }
  }

  /**
   * @ngdoc service
   * @name game.service:Game
   *
   * @description
   *
   */
  angular
    .module('common')
    .service('MessageService', MessageService);
}
