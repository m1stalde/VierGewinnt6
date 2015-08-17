/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');

var lobbyService = require('../services/lobbyService');

export function retrieveLobbyData(req : express.Request, res : express.Response){
  lobbyService.LobbyService.getAllRooms(function(err, data) {
      res.format({
          'application/json': function(){
              res.json(err || data);
          }
      });
  });
}
export function createNewGame(req : express.Request, res : express.Response){
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

export function  deleteGame(){
    lobbyService.LobbyService.getAllRooms();
}




