/// <reference path='../_lobby.ts' />

module lobby.services {
  export class LobbyStorage {

    private urlBase : string = "http://localhost:2999/lobby";

    getGames() {
        $.ajax({
          dataType: "json",
          url: this.urlBase,
        }).done(function(data){
            var ok = "test";
        });
      }
  }
}


