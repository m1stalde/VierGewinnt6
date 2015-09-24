/// <reference path="../_all.ts"/>
import security = require('../utils/security');

'use strict';

var eventEmitter: NodeJS.EventEmitter = new (require('events').EventEmitter)();

export const WILDCARD_MESSAGE_TYPE = '*';

/**
 * Sends message to all registered type or wildcard listeners.
 * @param message message to send
 */
export function sendMessage(message: IMessage): void {
    eventEmitter.emit(message.type, message);
    eventEmitter.emit(WILDCARD_MESSAGE_TYPE, message);
}

/**
 * Registers message listener for given message type or all message types if unspecified.
 * @param messageType message type or undefined
 * @param listener listener to call
 */
export function addMessageListener(messageType: string, listener: (message: IMessage) => void): void {
    eventEmitter.on(messageType, listener);

    if (!messageType) {
        eventEmitter.addListener(WILDCARD_MESSAGE_TYPE, listener);
    }
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

    /**
     * PlayerIds to broadcast message or undefined to avoid broadcast to clients.
     */
    playerIds: string[];

    /**
     * Connection object which is needed for the implementation of the chat
     */
    metaData?: IMessageMetaData;
}

export class ServerMessage<T> implements IMessage {

    type: string;
    data: T;
    playerIds: string[] = [];
    metaData: IMessageMetaData;

    constructor (type: string, data: T) {
        this.type = type;
        this.data = data;
    }
}

export interface IMessageMetaData{
    connObj : WebSocket;
    serverSession : security.IServerSession;
}