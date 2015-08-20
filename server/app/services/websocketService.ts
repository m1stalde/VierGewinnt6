/// <reference path="../_all.ts"/>

var WebSocketServer = require('ws').Server;
var util = require('util')
import gameService = require('./gameService');

export class WebsocketService {

    private chatHistory : Array<IChatMessage> = [];
    private clients : Array<IClient> = [];
    private wss : any;


    constructor() {}

    public setUpWebsocketService(server){
        // References the WebsocketService class
        var self = this;
        this.wss = new WebSocketServer({server: server})

        // Establishes a connection with the server
        this.wss.on('connection', function (conn) {

            // Assign a username to the connection
            self.mapUserNameToConn(conn);
            // Sends the chat history to the newly connected client
            self.sendChatHistoryToUser(conn);

            // Client is sending a message
            conn.on('message', function (messageString) {

                // Parse the incoming message
                var messageObj = JSON.parse(messageString);

                switch(messageObj.header.type){
                    case "chat":
                        self.handleChatMessage(messageObj);
                        break;
                    case "room":
                        break;
                    case "GameDoMoveMessage":
                        self.handleGameDoMoveMessage(messageObj);
                        break;
                }
            });

            conn.on('close', self.runCleanUpTask(self));
        });

        // Broadcast the delta to all the participants in the chat
        this.wss.broadcast = this.broadcastData;
    }

    private handleGameDoMoveMessage(message: any) {
        var self = this;

        gameService.doMove(message.body.gameId, message.body.col, function (err, gameData) {
            if (err) {
                // TODO implement websocket error handling
                return;
            }

            self.wss.broadcast({
                header : {
                    type : "GameUpdateMessage"
                },
                body : {
                    game: gameData
                }
            });
        });
    }

    private handleChatMessage(chatMessageObj : IChatMessage){

        switch(chatMessageObj.header.subType)
        {
            case "sendMessage":
                this.chatSendMessage(chatMessageObj);
                break;
        }
    }

    private mapUserNameToConn(conn){
        var userName = "User " + (this.clients.length + 1);
        this.clients.push({
            userName: userName,
            clientObj : conn
        });

        conn.send(JSON.stringify({
            header :  {
                type : "chat",
                subType : "sendAssignedUserName"
            },
            body : {
                userName: userName
            }
        }));
    }

    private runCleanUpTask(self){
        return function(){
            var userName;
            for (var i = 0; i < self.clients.length; ++i) {
                if(self.clients[i].clientObj === this){
                    userName = self.clients[i].userName
                    self.clients.splice(i, 1);
                }
            }
            console.log("User: " + userName + "has been disconnected");
        }
    }

    private broadcastData = function broadcast(data) {
        console.log("Broadcasting to all clients:\n " + util.inspect(data, {showHidden: false, depth: 5}));
        this.clients.forEach(function each(client) {
            client.send(JSON.stringify(data));
        });
    };

    private chatSendMessage(chatMessageObj : IChatMessage){

        // Process the message object
        chatMessageObj.body.creationDate = new Date().toLocaleTimeString().toString();

        // Add the message to the chat history
        this.chatHistory.push(chatMessageObj);

        if(chatMessageObj.body.sendTo && chatMessageObj.body.sendTo.length){
            // Send the message to a specific user
        } else{
            // Broadcast the message to all the subscribed clients
            this.wss.broadcast({
                header : {
                    type : "chat",
                    subType : "loadSingleMessage"
                },
                body : {
                    data : chatMessageObj
                }
            });
        }
    }

    private sendChatHistoryToUser(conn){
        this.chatHistory.length && conn.send(JSON.stringify({
            header : {
                type: "chat",
                subType: "loadHistory"
            },
            body :{
                data : this.chatHistory
            }
        }));
    }
}

export interface IRoomMessage extends IMessage {

    body : {

    }
}

export interface IChatMessage extends IMessage {
    body : {
        userName : string;
        message : string;
        creationDate : string;
        sendTo? : string[];
    }
}

export interface IMessage {
    header : {
        type : string;
        subType : string;
    }
}

 export interface IClient {
     clientObj : any;
     userName? : string;
 }

export interface IChatHistory extends IMessage {
    body : {
        data : Array<IChatMessage>;
    }
}



