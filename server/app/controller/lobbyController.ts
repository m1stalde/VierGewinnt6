/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');

var lobbyService = require('../services/lobbyService');
var websocketService = require('../websocket/websocketService');

export function retrieveLobbyData(req : express.Request, res : express.Response){
  lobbyService.getAllRooms(function(err, data) {
      res.format({
          'application/json': function(){
              res.json(err || data);
          }
      });
  });
}

export function createNewRoom(req : express.Request, res : express.Response){
    lobbyService.createRoom(req, function(err, data) {
        if(err){
            res.status(418).send(err);
        } else{
            res.format({
                'application/json': function(){
                    res.json(data);
                }
            });
        }
    });
}

export function joinRoom(req : express.Request, res : express.Response){
    lobbyService.joinRoom(req, function(err, data) {
        if(err){
            res.status(418).send(err);
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




