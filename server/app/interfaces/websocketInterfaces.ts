/**
 * Created by Alexander on 13.08.2015.
 */
import http   = require('http');

export interface IMessage {
    header : {
        type : string;
        subType : string;
    }
}

export interface IChatHistory extends IMessage{
    body : {
        data : Array<IChatMessage>;
    }
}

export interface IClient {
    clientObj : any;
    playerId: string;
    userName? : string;
}

export interface IChatMessage extends IMessage {
    body : {
        userName : string;
        message : string;
        creationDate : string;
        sendTo? : string[];
    }
}

export interface IWebsocketService {
    clients : Array<IClient>;
    returnWsServer(): http.Server;
    setUpWebsocketService(server : http.Server): http.Server;
    runCleanUpTask(self : any) : void;
    broadcastData(data : string): void;
}