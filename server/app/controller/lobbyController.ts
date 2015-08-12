/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');

var lobbyService = require('../services/lobbyService.js');

export class LobbyCtrl{
    public static retrieveLobbyData(req : express.Request, res : express.Response){
      lobbyService.LobbyService.getAllRooms(function(err, data) {
          res.format({
              'application/json': function(){
                  res.json(err || data);
              }
          });
      });
    }
    public static createNewGame(req : express.Request, res : express.Response){
        lobbyService.LobbyService.create(req, function(err, data) {
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
        lobbyService.LobbyService.getAllRooms();
    }
}



