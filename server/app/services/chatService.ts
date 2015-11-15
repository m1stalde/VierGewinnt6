/// <reference path="../_all.ts"/>
'use strict';

import util = require('util');
import messageService = require('../services/messageService');
import logger = require('../utils/logger');

// Each new chat section needs to be added to this array
var chatSections = new Array<string>('lobby', 'game');

var chatHistory = {};
var chatParticipants = {};

export function setUpChatEventListener() : void {
    // Foreach chat section
    chatSections.forEach(section => {
        // Chat history event handler
        messageService.addMessageListener(section + "ChatHistory", sendChatHistory);
        // Chat message event handler
        messageService.addMessageListener(section + "ChatMessage", sendChatMessage);
        // Chat unsubscribe event handler
        messageService.addMessageListener(section + "ChatUnsubscribe", unsubscribeUser);
    });

    // Deposit a sendMessage function which is used to deliver messages to the client
    messageService.addMessageListener("SendChatMessage", sendChatMessage);
}


export function sendChatHistory(message : ChatHistoryMessage){
    var prefix : string = message.data.chatSectionPrefix;
    var id : string = message.data.id;
    var conn : WebSocket = message.metaData.connObj;

    // Dynamically creates the room for the specific section (in case it doesn't already exist)
    if(!chatParticipants[prefix + id + "ChatParticipants"]){
        chatParticipants[prefix + id + "ChatParticipants"] = new Array<any>();
    }

    // Dynamically creates an empty chat history array (in case it doesn't already exist)
    if(!chatHistory[prefix + id + "ChatHistory"]){
        chatHistory[prefix + id + "ChatHistory"] = new Array<IChatMessage>();
    }

    // Add the connection object to the chat room
    var foundMatch : boolean = false
    for(var i = 0; i <  chatParticipants[prefix + id + "ChatParticipants"].length; i++)
    {
        if(chatParticipants[prefix + id + "ChatParticipants"][i] == conn){
            foundMatch = true;
        }
    }
    if(!foundMatch){
        chatParticipants[prefix + id + "ChatParticipants"].push(message.metaData.connObj);
    }


    // Send chat history to the client1
    var msgObj = new ChatHistoryMessage({
        chatHistory : chatHistory[prefix + id + 'ChatHistory'],
        chatSectionPrefix : prefix, // Client gets a generic message and just the "type" gets considered for the distribution => id gets with the current implementation ignored
        id : id
    });

    var msgStr = JSON.stringify(msgObj);
    message.metaData.connObj.send(msgStr);
}

// Wrapper function for the generic messageService.sendMessage() method
export function sendChatMessage(message : ChatInputMessage){

    // Does some preprocessing and adds the message to the chat history
    var preProcFn = preprocessingChatMessage(chatHistory);
    var msgObj = preProcFn(message);

    if(msgObj){
        broadcastChatMessage(msgObj);
    }
}

export function unsubscribeUser(message : UnsubscribeToChatSectionMessage){
    var section = message.data.chatSectionPrefix + "ChatParticipants";
    if(chatParticipants[section]) {
        for (var i = 0; i < chatParticipants[section].length; i++) {
            // Loop through the sent chat section and remove the connection in case of a match
            if (chatParticipants[section][i] === message.metaData.connObj) {
                chatParticipants[section].splice(i, 1);
                return;
            }
        }
    }
}

function broadcastChatMessage(message : ChatInputMessage){
    var msgStr = JSON.stringify(message);

    chatParticipants[message.data.chatSectionPrefix + message.data.id + "ChatParticipants"].forEach(participant => {
        try {
            participant.send(msgStr);
        } catch (ex) {
            logger.error('send message to client failed: ' + util.inspect(participant, {showHidden: false, depth: 1}));
        }
    });
}

function preprocessingChatMessage(chatHistory){
 return function(message : ChatInputMessage){
     // Strips away the meta data which were appended at the beginning
     var responseMsg = new ChatInputMessage({
         chatSectionPrefix : message.data.chatSectionPrefix,
         chatMessageObj : message.data.chatMessageObj,
         id : message.data.id
     });

     // ChatMessage validation - Simple chat message validation (avoid XSS)
     responseMsg.data.chatMessageObj.message = responseMsg.data.chatMessageObj.message.replace(/[<>]/g,"");
     responseMsg.data.chatMessageObj.creationDate = new Date().toLocaleTimeString().toString();
     responseMsg.data.chatMessageObj.from = message.metaData.serverSession.getUserName();

    if(responseMsg.data.chatMessageObj !== null) {
        var prefix = responseMsg.data.chatSectionPrefix;
        var id = responseMsg.data.id;
        chatHistory[prefix + id + "ChatHistory"].push(responseMsg.data.chatMessageObj);
        return responseMsg;
    }
 }
}

function getChatSectionAsString(type : string){
    return type.match(/^[a-z]+/)[0];
}

// Message Service
export interface IChatData{
    chatSectionPrefix : string; // Chat Section
    id? : string // Possible to create a subsection for a section (optional - used for the game)
    chatMessageObj : IChatMessage;
}

export interface IChatHistory{
    chatSectionPrefix : string; // Chat Section
    id? : string // Possible to create a subsection for a section (optional - used for the game)
    chatHistory : Array<IChatMessage>;
}

export interface IChatUnsubscribe{
    chatSectionPrefix : string;
    id? : string // Possible to create a subsection for a section (optional - used for the game)
}

export class ChatInputMessage extends messageService.ServerMessage<IChatData> {
    static NAME = "ChatMessage";

    constructor (chatData: IChatData) {
        super(chatData.chatSectionPrefix + ChatInputMessage.NAME, chatData, chatData.id);
    }
}

export class ChatHistoryMessage extends messageService.ServerMessage<IChatHistory> {
    static NAME = "ChatHistory";

    constructor (chatData: IChatHistory) {
        super(chatData.chatSectionPrefix + ChatHistoryMessage.NAME, chatData, chatData.id);
    }
}

export class UnsubscribeToChatSectionMessage extends messageService.ServerMessage<IChatUnsubscribe> {
    static NAME = "ChatUnsubscribing";

    constructor (data: IChatUnsubscribe) {
        super(data.chatSectionPrefix + UnsubscribeToChatSectionMessage.NAME, data, data.id);
    }
}

// Message
export interface IChatMessage{
    message : string;
    creationDate : string;
    from : string;
    to : string;
}










