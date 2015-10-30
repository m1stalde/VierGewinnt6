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
// Any pending websocket connection
var clients : Array<IClient> = [];

var regexChat = /^[A-Z][a-z]+Chat[A-Z]+/;
var regexChatHistory = /^[a-z]+ChatHistory$/;

exports.clients = clients;

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

    // Sets up all the the chat related event listeners
    chatService.setUpChatEventListener();

    wsServer = new WebSocketServer({server: server});

    // Establishes a connection with the server
    wsServer.on('connection', function (conn: WebSocket) {

        // Assign a username to the connection
        mapMetaDataToConn(conn);

        // Client is sending a message
        conn.on('message', function (messageString : string) {

            // Parse the incoming message
            var messageObj : messageService.IMessage = JSON.parse(messageString);
            var conn = this;

            // Handles the meta data for the websocket object
            serverSession : security.getServerSessionFromWebSocket(this, function(err, session : security.IServerSession){
                if(!err){
                    // Sets the meta data
                    messageObj.metaData = {
                        connObj : conn,
                        serverSession : session
                    }

                    // Hands the modified message object over to the messageService => gets further distributed by the service to its subscribers
                    messageService.sendMessage(messageObj);
                }
            });
        });

        conn.on('close', runCleanUpTask(this));
    });

    return wsServer;
}

function mapMetaDataToConn(conn: WebSocket){
    security.getServerSessionFromWebSocket(conn, function(err, serverSession) {
        if (err) {
            console.error("get server session from web socket failed: " + err);
            return;
        }

        var userName = serverSession.getUserName(),
            playerId = serverSession.getPlayerId();

        console.info('player ' + playerId + ' connected');

        var foundMatch = false;
        for (var i = 0; i < clients.length; ++i) {
            if(clients[i].userName === userName){
                clients[i].clientObj = conn;
                clients[i].playerId = playerId;
                foundMatch = true;
            }
        }

        if(!foundMatch) {
            clients.push({
                userName: userName,
                clientObj: conn,
                playerId: playerId
            });
        }
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
        //TODO client filter deactivated because playerIds in different websocket and http sessions doesn't match anymore
        //if (client.playerId && message.playerIds.indexOf(client.playerId) != -1) {
            try {
                client.clientObj.send(JSON.stringify(message));
            } catch (ex) {
                console.error('send message to client failed: ' + util.inspect(client, {showHidden: false, depth: 1}));
            }
        //}
    });
}


export function sendMessageToPlayers(message: messageService.IMessage) {
    // check for userIds to broadcast to
    if (!message.playerIds || message.playerIds.length === 0) {
        return;
    }

    // send message to clients matching the messages userIds
    console.log("sending message to clients:\n " + util.inspect(message, {showHidden: false, depth: 1}));
    clients.forEach(client => {
        //TODO client filter deactivated because playerIds in different websocket and http sessions doesn't match anymore
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
