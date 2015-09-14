/// <reference path="../_all.ts"/>

import messageService = require('../services/messageService');

var lobbyChatHistory: Array<messageService.IMessage> = [];
var gameChatHistory: Array<messageService.IMessage> = [];

var regexLobbyChat = /^Chat[A-Z]/;
var regexGameChat = /^Chat[A-Z]/;

export function retrieveLobbyChatHistory() : Array<messageService.IMessage>{
    return lobbyChatHistory;
}

// Wrapper function for the generic messageService.sendMessage() method
export function sendChatMessage(message : messageService.IMessage){

    // ChatMessage validation - Simple chat message validation (avoid XSS)
    message.data.message = message.data.message.replace(/[<>]/g,"");
    message.data.creationDate = new Date().toLocaleTimeString().toString();

    if(message.data !== null) {
        // Further rooting regarding the particular chat section
        if(regexLobbyChat.test(message.type)){
            lobbyChatHistory.push(message);

        } else if(regexGameChat.test(message.type)){
            gameChatHistory.push(message);
        }
    }

    messageService.sendMessage(message);

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
        // Covers all the different chat areas => lobby, game, ..
        ChatInputMessage.NAME = chatData.chatSectionPrefix +  ChatInputMessage.NAME;
        super(ChatInputMessage.NAME, chatData);
    }
}

export class ChatHistoryMessage extends messageService.ServerMessage<IChatHistory> {
    static NAME = "ChatHistory";

    constructor (chatData: IChatHistory) {
        super(ChatHistoryMessage.NAME, chatData);
    }
}

// Message
export interface IChatMessage{
    message : string;
    creationDate : string;
    from : string;
    to : string;
}










