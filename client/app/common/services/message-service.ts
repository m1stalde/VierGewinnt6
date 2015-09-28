///<reference path='../../../typings/tsd.d.ts' />
module Common.Services {
  'use strict';

  export interface IMessageService {
    addMessageListener(messageType:string, listener:(message:IMessage) => void);
    removeMessageListener(messageType:string, listener:(message:IMessage) => void);
    removeMessageListenerType(messageType:string);
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

    private timerId = 0;

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
      this.ws.onclose = (event) => self.onClose(event);
    }

    public addMessageListener(messageType:string, listener:(message:IMessage) => void) {
      this.$log.debug("adding message listener " + listener + " for message type " + messageType);

      if (!this.messageListeners.hasOwnProperty(messageType)) {
        this.messageListeners[messageType] = new Array();
      }

      this.messageListeners[messageType].push(listener);
    }

    // Erases the whole type from the message listener object
    public removeMessageListenerType(messageType:string) {
      this.$log.debug("removing message listener type from message listener object" + messageType);

      if (!this.messageListeners.hasOwnProperty(messageType)) {
        return
      }

      this.messageListeners.forEach(listener => {
          if(listener[messageType] === messageType){
            listener[messageType] = null;
          }
        }
      );
    }

    public removeMessageListener(messageType:string, listener:(message:IMessage) => void){
      this.$log.debug("removing message listener " + listener + " for message type " + messageType);

      if (!this.messageListeners.hasOwnProperty(messageType)) {
        return
      }

      // foreach type of message listener
      for(var key in this.messageListeners) {
        if(key == messageType){
          // foreach function in this particular type
          for(var i = 0; i < this.messageListeners[key].length; i++){
            if(this.messageListeners[key][i] == listener){
              this.messageListeners[key].splice(i,1);
              return;
            }
          }
        }
      }
    }

    public sendMessage(message:IMessage) {
      var self = this;
      // In case of a closed connection => establish a new one
      if (this.ws.readyState == WebSocket.CLOSING || this.ws.readyState === WebSocket.CLOSED) {
        this.connect(this.appConfig.baseWsUrl);
        // Because the connection process takes a while, you can't directly afterwards send a message to the server => thus the callback pattern
        this.waitForConnection(function () {
          self.ws.send(JSON.stringify(message));
        }, 500)
      } else if(this.ws.readyState === WebSocket.CONNECTING){ // Websocket ist still connecting => retrigger the sendMessage function
        this.waitForConnection(function () {
          self.sendMessage(message)},
          500)
      } else {
        this.ws.send(JSON.stringify(message));
      }
    }

    private waitForConnection = function (callback : () => void, interval : number) {
      if (this.ws.readyState === WebSocket.OPEN) {
        callback();
      } else {
        var self = this;
        // Trigger the waitForConnection function again => usually isn't necessary
        setTimeout(function () {
          self.waitForConnection(callback, interval);
        }, interval);
      }
    };

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

    private onClose(event:Event) {
      this.$log.info("Websocket connection has been closed: " + event);
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
