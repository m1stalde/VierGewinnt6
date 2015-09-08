/**
 * Created by Alexander on 04.08.2015.
 */

module lobby.interfaces{
  "use strict";

  export interface IRoom extends ng.resource.IResource<IRoom> {
    roomId?: string;
    name?: string;
    status?: string;
    creationTime?: string;
    players?: Array<IPlayer>;
    isDelete? : boolean;
    isJoin? : boolean;
  }

  export interface IPlayer {
    userName : string;
    playerId : string;
  }

  export class Room implements IRoom {
    public roomId : string;
    public name: string;
    public status: string;
    public creationTime: string;
    public players: Array<IPlayer>;
    public isDelete : boolean;
    public isJoin : boolean;

      constructor(room : IRoom){
        if(room !== null){
          this.roomId = room.roomId;
          this.name= room.name;
          this.status= room.status;
          this.creationTime= room.creationTime;
          this.players= room.players;
          this.isDelete= room.isDelete;
          this.isJoin= room.isJoin;
        }
      }
  }
}
