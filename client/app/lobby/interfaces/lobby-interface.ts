/**
 * Created by Alexander on 04.08.2015.
 */

module lobby.interfaces{
  "use strict";

  export interface Room extends ng.resource.IResource<Room> {
    roomId: string;
    title: string;
    status: string;
    creationDate: string;
    players: Array<string>;
  }

  export interface IRoomResource extends ng.resource.IResourceClass<Room> {

  }
}
