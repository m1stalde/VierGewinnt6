/// <reference path="../_all.ts"/>

var chatHistory: Array<app.interfaces.IChatMessage> = [];

export function retrieveChatHistory() : Array<app.interfaces.IChatMessage>{
    return chatHistory;
}

export function handleChatMessage(chatMessageObj:app.interfaces.IChatMessage) {

    switch (chatMessageObj.header.subType) {
        case "sendMessage":
            return retrieveChatMessageWsObject(chatMessageObj);
            break;
    }
}

export function returnChatHistoryWsObject(): app.interfaces.IChatHistory {
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

export function retrieveChatMessageWsObject(chatMessageObj:app.interfaces.IChatMessage) {

    // Process the message object
    chatMessageObj.body.creationDate = new Date().toLocaleTimeString().toString();

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




