/// <reference path="../_all.ts"/>
import util = require('util');
import messageService = require('../services/messageService');

// Each new chat section needs to be added to this array
var chatSections = new Array<string>('lobby', 'game');

var chatHistory = {};
var chatParticipants = {};

export function setUpChatEventListener() : void {
    // Foreach chat section
    chatSections.forEach(section => {
        // Chat history event handler
        messageService.addMessageListener(section + "ChatHistory", sendChatHistory);
        // Chat history event handler
        messageService.addMessageListener(section + "ChatMessage", sendChatMessage);
    })

    // Deposit a sendMessage function which is used to deliver messages to the client
    messageService.addMessageListener("SendChatMessage", sendChatMessage);
}


export function sendChatHistory(message : ChatHistoryMessage){
    var prefix = message.data.chatSectionPrefix;

    // Dynamically creates the room for the specific section (in case it doesn't already exist)
    if(!chatParticipants[prefix + "ChatParticipants"]){
        chatParticipants[prefix + "ChatParticipants"] = new Array<any>();
    }

    // Dynamically creates an empty chat history array (in case it doesn't already exist)
    if(!chatHistory[prefix + "ChatHistory"]){
        chatHistory[prefix + "ChatHistory"] = new Array<IChatMessage>();
    }

    // Add the connection object to the chat room
    chatParticipants[prefix + "ChatParticipants"].push(message.metaData.connObj);

    // Send chat history to the client1
    var msgObj = new ChatHistoryMessage({
        chatHistory : chatHistory[prefix + 'ChatHistory'],
        chatSectionPrefix : prefix,
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

function broadcastChatMessage(message : ChatInputMessage){
    var msgStr = JSON.stringify(message);

    chatParticipants[message.data.chatSectionPrefix + "ChatParticipants"].forEach(participant => {
        try {
            participant.send(msgStr);
        } catch (ex) {
            console.error('send message to client failed: ' + util.inspect(participant, {showHidden: false, depth: 1}));
        }
    });
}

function preprocessingChatMessage(chatHistory){
 return function(message : ChatInputMessage){
     // Strips away the meta data which were appended at the beginning
     var responseMsg = new ChatInputMessage({
         chatSectionPrefix : message.data.chatSectionPrefix,
         chatMessageObj : message.data.chatMessageObj
     });

     // ChatMessage validation - Simple chat message validation (avoid XSS)
     responseMsg.data.chatMessageObj.message = responseMsg.data.chatMessageObj.message.replace(/[<>]/g,"");
     responseMsg.data.chatMessageObj.creationDate = new Date().toLocaleTimeString().toString();
     responseMsg.data.chatMessageObj.from = message.metaData.serverSession.getUserName();

    if(responseMsg.data.chatMessageObj !== null) {
        var prefix = responseMsg.data.chatSectionPrefix;
        chatHistory[prefix + "ChatHistory"].push(responseMsg.data.chatMessageObj);
        return responseMsg;
    }
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










