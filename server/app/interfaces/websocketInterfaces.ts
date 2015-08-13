/**
 * Created by Alexander on 13.08.2015.
 */

module app.intefaces {

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
}