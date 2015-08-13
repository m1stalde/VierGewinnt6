/// <reference path="../../_all.ts"/>
var WebSocketServer = require('ws').Server;
var util = require('util');

var chatWebsocketService = require('../../services/websocket/chatWebsocketService.js');


export class WebsocketService {

    private clients : Array<app.intefaces.IClient> = [];
    private wss : any;

    private chatWs;

    constructor() {
        this.init();
    }

    public init(){
        // Init
        var ChatWebsocketService = chatWebsocketService.ChatWebsocketService;
        this.chatWs = new ChatWebsocketService();
    }

    public setUpWebsocketService(server){
        // References the WebsocketService class
        var self = this;
        this.wss = new WebSocketServer({server: server})

        // Establishes a connection with the server
        this.wss.on('connection', function (conn) {

            // Assign a username to the connection
            self.mapUserNameToConn(conn);

            // Sends the chat history to the newly connected client
            if(self.chatWs.chatHistory > 0){
                conn.send(
                    JSON.stringify(self.chatWs.returnChatHistory())
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
                        processedMsgObj = self.chatWs.handleChatMessage(messageObj);
                        break;
                    case "room":
                        break;
                }

                self.wss.broadcast(processedMsgObj);
            });

            conn.on('close', self.runCleanUpTask(self));
        });

        // Broadcast the delta to all the participants in the chat
        this.wss.broadcast = this.broadcastData;
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
            console.log("User: " + userName + " has been disconnected");
        }
    }

    private broadcastData = function broadcast(data) {
        console.log("Broadcasting to all clients:\n " + util.inspect(data, {showHidden: false, depth: 5}));
        this.clients.forEach(function each(client) {
            client.send(JSON.stringify(data));
        });
    };
}









