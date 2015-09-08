/// <reference path="../_all.ts"/>

import interfaces = require("../interfaces/websocketInterfaces");

var chatHistory: Array<interfaces.IChatMessage> = [];

export function retrieveChatHistory() : Array<interfaces.IChatMessage>{
    return chatHistory;
}

export function handleChatMessage(chatMessageObj:interfaces.IChatMessage) {

    switch (chatMessageObj.header.subType) {
        case "sendMessage":
            return retrieveChatMessageWsObject(chatMessageObj);
            break;
    }
}

export function returnChatHistoryWsObject(): interfaces.IChatHistory {
    if (chatHistory.length) {
        return {
            header: {
                type: "chat",
                subType: "loadHistory"
            },
            body: {
                data: chatHistory
            }
        };
    }
}

export function retrieveChatMessageWsObject(chatMessageObj:interfaces.IChatMessage) {

    // Process the message object
    chatMessageObj.body.creationDate = new Date().toLocaleTimeString().toString();

    // Simple chat message validator => needs to be improved (avoid XSS)
    chatMessageObj.body.message = chatMessageObj.body.message.replace(/[<>]/g,"");

    // Add the message to the chat history
    chatHistory.push(chatMessageObj);

    if (chatMessageObj.body.sendTo && chatMessageObj.body.sendTo.length) {
        // Send the message to a specific user
    } else {
        // Broadcast the message to all the subscribed clients
        return {
            header: {
                type: "chat",
                subType: "loadSingleMessage"
            },
            body: {
                data: chatMessageObj
            }
        }
    }
}




