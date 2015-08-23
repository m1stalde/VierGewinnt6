///<reference path='../../../typings/tsd.d.ts' />
module Common.Services {
  'use strict';

  export interface IMessageService {
    sendMessage(message: IMessage);
  }

  export interface IMessage {
    type: string;
    data: any;
  }

  class MessageService implements IMessageService {

    private ws: WebSocket;

    public static $inject = [
      '$log', '$rootScope'
    ];

    constructor(private $log : ng.ILogService, private $rootScope: ng.IScope) {
      // Websocket configuration
      this.ws = new WebSocket('ws://localhost:2999');
      var self = this;

      this.ws.onmessage = (event) => self.onMessage(event);
      this.ws.onopen = (event) => self.onOpen(event);
      this.ws.onerror = (error) => self.onError(error);
    }

    public sendMessage(message: IMessage) {
      if (this.ws.readyState != WebSocket.OPEN) {
        throw new Error('Not connected');
      }

      //var messageName = Object.getPrototypeOf(message).name;
      var sendMessage = {
        header: {
          type: message.type
        },
        body: message.data
      };

      this.ws.send(JSON.stringify(sendMessage));
    }

    private onMessage(message: MessageEvent) {
      this.$log.info("message received: " + message);

      var recvMessage = JSON.parse(message.data);
      var messageType = recvMessage.header.type;

      var message: IMessage = {
        type: recvMessage.header.type,
        data: recvMessage.body
      }

      this.$rootScope.$broadcast(messageType, message);
    }

    private onOpen(message: Event) {
      this.$log.info("WebSocket Open: " + message);
    }

    private onError(error: ErrorEvent) {
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
