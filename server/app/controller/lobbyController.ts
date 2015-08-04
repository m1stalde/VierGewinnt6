/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');

var lobbyService = require('../services/lobbyService.js');

export class LobbyCtrl{
    public static retrieveLobbyData(req : express.Request, res : express.Response){
      lobbyService.Lobby.getAllRooms(function(err, data) {
          res.format({
              'application/json': function(){
                  res.json(err || data);
              }
          });
      });
    }
    public static createNewGame(req : express.Request, res : express.Response){

        var newGame = {
            roomId : req.body.roomId,
            title : req.body.title,
            status : req.body.status,
            creationDate : req.body.creationDate,
            players : req.body.players,
        }

        lobbyService.Lobby.create(newGame, function(err, data) {
            if(err){
                res.format({
                    'application/json': function(){
                        res.json(err);
                    }
                });
            } else{
                res.format({
                    'application/json': function(){
                        res.json(data);
                    }
                });
            }
        });
    }
    public static deleteGame(){
        lobbyService.Lobby.getAllRooms();
    }
}



