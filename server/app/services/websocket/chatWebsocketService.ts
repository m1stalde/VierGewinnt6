/// <reference path="../../_all.ts"/>

export class ChatWebsocketService{

    public chatHistory : Array<app.intefaces.IChatMessage> = [];

    constructor(){}

    private retrieveChatMessage(chatMessageObj : app.intefaces.IChatMessage){

        // Process the message object
        chatMessageObj.body.creationDate = new Date().toLocaleTimeString().toString();

        // Add the message to the chat history
        this.chatHistory.push(chatMessageObj);

        if(chatMessageObj.body.sendTo && chatMessageObj.body.sendTo.length){
            // Send the message to a specific user
        } else{
            // Broadcast the message to all the subscribed clients
            return {
                header : {
                    type : "chat",
                    subType : "loadSingleMessage"
                },
                body : {
                    data : chatMessageObj
                }
            }
        }
    }

    public handleChatMessage(chatMessageObj : app.intefaces.IChatMessage){

        switch(chatMessageObj.header.subType)
        {
            case "sendMessage":
                return this.retrieveChatMessage(chatMessageObj);
                break;
        }
    }

    public returnChatHistory() :  app.intefaces.IChatHistory{
        if(this.chatHistory.length){
            return {
                header : {
                    type: "chat",
                    subType: "loadHistory"
                },
                body :{
                    data : this.chatHistory
                }
            };
        }
    }
}


