/// <reference path="../_all.ts"/>
import WebSocket = require('ws');
import security = require('../utils/security');
import express = require('express');
import util = require('util');
import helperFn = require('../utils/helperFunctions');
import chatService = require("../services/chatService");
import messageService = require('../services/messageService');

var WebSocketServer = WebSocket.Server;
var wsServer;
var clients : Array<IClient> = [];

exports.clients = clients;

var regexChat = /^Chat[A-Z]/;

export interface IMessage {
    type: string;
    data: any;
}

export function returnWsServer(){
    return wsServer;
}

export function setUpWebsocketService(server) {
    // register for all message types to broadcast all server messages to all clients
    messageService.addMessageListener(messageService.WILDCARD_MESSAGE_TYPE, sendMessage);
    //messageService.addMessageListener("LobbyChatMessage", null);
    //messageService.addMessageListener("GameChatMessage", null);

    wsServer = new WebSocketServer({server: server});

    // Establishes a connection with the server
    wsServer.on('connection', function (conn: WebSocket) {

        // Assign a username to the connection
        mapMetaDataToConn(conn);

        // Client is sending a message
        conn.on('message', function (messageString : string) {

            // Parse the incoming message
            var messageObj : messageService.IMessage = JSON.parse(messageString);

            if(regexChat.test(messageObj.type)){
                // Call the chatService to send the message
                chatService.sendChatMessage(messageObj);
            }

            // Send the messageObj to the message service for further distribution
            messageService.sendMessage(messageObj);

        });

        conn.on('close', runCleanUpTask(this));
    });

    return wsServer;
}

function mapMetaDataToConn(conn: WebSocket){
    security.getServerSessionFromWebSocket(conn, function(err, serverSession) {
        var userName = "User " + (helperFn.getHighestValue<number>(clients, "userName", 0) + 1);
        var playerId = serverSession.getPlayerId();

        console.info('player ' + playerId + ' connected');

        clients.push({
            userName: userName,
            clientObj : conn,
            playerId: playerId
        });

        var userData = new UserData({
            userName : userName,
            playerId : playerId
        });

        conn.send(JSON.stringify(new MetaDataMessage({
            metaData : userData
        })));
    });
}



function runCleanUpTask(self){
    return function(){
        var userName;
        for (var i = 0; i < self.clients.length; ++i) {
            if(self.clients[i].clientObj === this){
                userName = self.clients[i].userName;
                self.clients.splice(i, 1);
            }
        }
        console.log("User: " + userName + " has been disconnected");
    }
}


/**
 * Sends message to clients for defined users. If message contains no userIds, the message is ignored.
 * @param message message with userIds to send to.
 */
function sendMessage(message: messageService.IMessage) {
    // check for userIds to broadcast to
    if (!message.playerIds || message.playerIds.length === 0) {
        return;
    }

    // send message to clients matching the messages userIds
    console.log("sending message to clients:\n " + util.inspect(message, {showHidden: false, depth: 1}));
    clients.forEach(client => {
        if (client.playerId && message.playerIds.indexOf(client.playerId) != -1) {
            try {
                client.clientObj.send(JSON.stringify(message));
            } catch (ex) {
                console.error('send message to client failed: ' + util.inspect(client, {showHidden: false, depth: 1}));
            }
        }
    });
};

export interface IClient {
    playerId : string;
    userName? : string;
    clientObj : WebSocket;
}

export interface IUserData{
    userName : string;
    playerId : string;
}

export interface IMetaDataExchange{
     metaData : IUserData;
}

export class UserData{
    public userName;
    public playerId;
    constructor(data : IUserData){
        this.userName = data.userName;
        this.playerId = data.playerId;
    }
}

export class MetaDataMessage extends messageService.ServerMessage<IMetaDataExchange> {
    static NAME = "MetaDataMessage";

    constructor (metaData: IMetaDataExchange) {
        super(MetaDataMessage.NAME, metaData);
    }
}