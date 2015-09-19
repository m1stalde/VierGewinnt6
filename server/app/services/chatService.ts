/// <reference path="../_all.ts"/>

import messageService = require('../services/messageService');

var chatHistory = {
    lobbyChatHistory: new Array<messageService.IMessage>(),
    gameChatHistory: new Array<messageService.IMessage>()
};

// Array<messageService.IMessage>

var regexChatHistory = /(?<=[\w+])ChatHistory$/;
var regexSendMessage = /(?<=[\w+])ChatMessage$/;

// Wrapper function for the generic messageService.sendMessage() method
export function sendChatMessage(message : messageService.IMessage){

    // Send the chat history
    if(regexChatHistory.test(message.type)){
        message.data.chatHistory = preprocessingChatHistory(message);

    } else if(regexSendMessage.test(message.type)){ // Send a simple chat message
        preprocessingChatMessage(message);
    }

    // Send the message object to the client(s)
    messageService.sendMessage(message);
}

function preprocessingChatMessage(message : messageService.IMessage){

    // ChatMessage validation - Simple chat message validation (avoid XSS)
    message.data.message = message.data.message.replace(/[<>]/g,"");
    message.data.creationDate = new Date().toLocaleTimeString().toString();

    if(message.data !== null) {
        var type = message.type.toLocaleLowerCase();
        var chatHistory = chatHistory[type + "ChatHistory"];
        chatHistory.push(message);

        return true;
    }

     return false;
}

function preprocessingChatHistory(message : messageService.IMessage)
{
    var type = message.type.toLocaleLowerCase();
    var chatHistory = chatHistory[type + "ChatHistory"];
    return chatHistory;
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
        // Covers all the different chat areas => lobby, game, ..
        ChatInputMessage.NAME = chatData.chatSectionPrefix +  ChatInputMessage.NAME;
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










