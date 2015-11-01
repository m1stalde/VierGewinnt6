/// <reference path='../_lobby.ts' />
module lobby.models {
  "use strict";
   export class Room {
      roomId: string;title: string;
      status: string;
      creationDate: string;
      players: Array<string>;
    }
  }
