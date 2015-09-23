/// <reference path="../_all.ts"/>
import util = require('util');
import messageService = require('../services/messageService');

var chatHistory = {
    lobbyChatHistory: new Array<messageService.IMessage>(),
    gameChatHistory: new Array<messageService.IMessage>()
};

var chatParticipants = {
    lobbyChatParticipants: new Array<any>(),
    gameChatParticipants: new Array<any>()
};

var chatSections = new Array<string>('lobby', 'game');

export function setUpChatEventListener() : void {
    // Foreach chat section
    chatSections.forEach(section => {
        // Chat history event handler
        messageService.addMessageListener(section + "ChatHistory", sendChatHistory);
        // Chat history event handler
        messageService.addMessageListener(section + "ChatMessage", sendChatMessage);
    })
}


export function sendChatHistory(message : ChatHistoryMessage){
    var prefix = message.data.chatSectionPrefix;

    // Add the connection object to the chat room
    chatParticipants[prefix + "ChatParticipants"].push(message.connObj);

    // Send chat history to the client
    var msgObj = new ChatHistoryMessage({
        chatHistory : chatHistory[prefix + 'ChatHistory'],
        chatSectionPrefix : prefix
    });

    var msgStr = JSON.stringify(msgObj);
    message.connObj.send(msgStr);
}

// Wrapper function for the generic messageService.sendMessage() method
export function sendChatMessage(message : messageService.IMessage){
    // Does some preprocessign and adds the message to the chat history
    var msgObj = preprocessingChatMessage(message);

    if(msgObj){
        broadcastChatMessage(msgObj.data.chatMessageObj);
    }
}

function broadcastChatMessage(message : IChatData){
    var msgStr = JSON.stringify(message.chatMessageObj);

    chatParticipants[message.chatSectionPrefix + "ChatParticipants"].forEach(participant => {
        try {
            participant.clientObj.send(msgStr);
        } catch (ex) {
            console.error('send message to client failed: ' + util.inspect(participant, {showHidden: false, depth: 1}));
        }
    });
}

function preprocessingChatMessage(message : messageService.IMessage){

    // ChatMessage validation - Simple chat message validation (avoid XSS)
    message.data.chatMessageObj.message = message.data.message.replace(/[<>]/g,"");
    message.data.chatMessageObj.creationDate = new Date().toLocaleTimeString().toString();

    if(message.data.chatMessageObj !== null) {
        var prefix = message.data.chatSectionPrefix;
        var chatHistory = chatHistory[prefix + "ChatHistory"];
        chatHistory.push(message);

        return message;
    }
}

function getChatSectionAsString(type : string){
    return type.match(/^[a-z]+/)[0];
}

// Message Service
export interface IChatData{
    chatSectionPrefix : string;
    chatMessageObj : IChatMessage;
}

export interface IChatHistory{
    chatSectionPrefix : string;
    chatHistory : Array<IChatMessage>;
}

export class ChatInputMessage extends messageService.ServerMessage<IChatData> {
    static NAME = "ChatMessage";

    constructor (chatData: IChatData) {
        super(chatData.chatSectionPrefix + ChatInputMessage.NAME, chatData);
    }
}

export class ChatHistoryMessage extends messageService.ServerMessage<IChatHistory> {
    static NAME = "ChatHistory";

    constructor (chatData: IChatHistory) {
        super(chatData.chatSectionPrefix + ChatHistoryMessage.NAME, chatData);
    }
}

// Message
export interface IChatMessage{
    message : string;
    creationDate : string;
    from : string;
    to : string;
}










