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
    players?: Array<string>;
  }

  export interface IRoomResource extends ng.resource.IResourceClass<IRoom> {

  }
}
