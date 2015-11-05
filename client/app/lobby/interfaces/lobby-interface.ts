/**
 * Created by Alexander on 04.08.2015.
 */

module lobby.interfaces{
  "use strict";

  export interface IRoomRessource extends ng.resource.IResource<IRoomRessource> {
    roomId?: string;
    name?: string;
    status?: string;
    creationTime?: string;
    players?: Array<IPlayer>;
    isDelete? : boolean;
    isJoin? : boolean;
    gameId?: string;
  }

  export interface IPlayer {
    userName : string;
    playerId : string;
  }

  export class Room {
    public roomId : string;
    public name: string;
    public status: string;
    public creationTime: string;
    public players: Array<IPlayer>;
    public isDelete : boolean;
    public isJoin : boolean;
    public gameId: string;

      constructor(room : IRoomRessource){
        if(room !== null){
          this.roomId = room.roomId;
          this.name= room.name;
          this.status= room.status;
          this.creationTime= room.creationTime;
          this.players= room.players;
          this.isDelete= room.isDelete;
          this.isJoin= room.isJoin;
          this.gameId = room.gameId;
        }
      }
  }
}
