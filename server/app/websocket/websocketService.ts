/// <reference path="../_all.ts"/>

var WebSocketServer = require('ws').Server;
import express = require('express');
var util = require('util');
var helperFn = require('../utils/helperFunctions.js');

var chatWebsocket = require('./chatWebsocketService.js');
import messageService = require('../services/messageService');

var wsServer;
var clients : Array<app.interfaces.IClient> = [];

exports.clients = clients;

export function returnWsServer(){
    return wsServer;
}

export function setUpWebsocketService(server) {
    // register for all message types to broadcast all server messages to all clients
    messageService.addMessageListener(messageService.WILDCARD_MESSAGE_TYPE, sendMessage);

    wsServer = new WebSocketServer({server: server});

    // Establishes a connection with the server
    wsServer.on('connection', function (conn) {

        // Assign a username to the connection
        mapMetaDataToConn(conn);

        // Sends the chat history to the newly connected client
        if(chatWebsocket.retrieveChatHistory().length > 0){
            conn.send(
                JSON.stringify(chatWebsocket.returnChatHistoryWsObject())
            );
        }

        // Client is sending a message
        conn.on('message', function (messageString) {

            // Parse the incoming message
            var messageObj = JSON.parse(messageString);

            // Processed message which will be sent back to the client
            var processedMsgObj : app.intefaces.IMessage;

            switch(messageObj.header.type){
                case "chat":
                    processedMsgObj = chatWebsocket.handleChatMessage(messageObj);
                    break;
                case "room":
                    break;
            }

            if (processedMsgObj) {
                wsServer.broadcast(processedMsgObj);
            }
        });

        conn.on('close', runCleanUpTask(this));
    });

    // Broadcast the delta to all the participants in the chat
    wsServer.broadcast = broadcastData;

    return wsServer;
}

function mapMetaDataToConn(conn){
    var userName = "User " + (clients.length + 1);
    var playerId = helperFn.Utils.createGuidcreateGuid();
    clients.push({
        userName: userName,
        clientObj : conn,
        playerId: playerId
    });

    conn.send(JSON.stringify({
        header :  {
            type : "chat",
            subType : "sendMetaDataToUser"
        },
        body : {
            userName: userName,
            playerId: playerId
        }
    }));
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

export function broadcastData(data) {
    console.log("Broadcasting to all clients:\n " + util.inspect(data, {showHidden: false, depth: 5}));
    this.clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
};

/**
 * Sends message to clients for defined users. If message contains no userIds, the message is ignored.
 * @param message message with userIds to send to.
 */
function sendMessage(message: messageService.IMessage) {
    // check for userIds to broadcast to
    if (!message.userIds || message.userIds.length === 0) {
        return;
    }

    // send message to clients matching the messages userIds
    console.log("sending message to clients:\n " + util.inspect(message, {showHidden: false, depth: 1}));
    clients.forEach(client => {
        // TODO implement userId for client connections
        //if (message.userIds.indexOf(client.playerId) != -1) {
            // TODO implement exception handling to prevent server from shutdown on send error
            client.clientObj.send(JSON.stringify(message));
        //}
    });
};


