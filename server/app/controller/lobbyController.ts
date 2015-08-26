/// <reference path="../_all.ts"/>

import http = require('http');
import express = require('express');
var path = require("path");

var lobbyService = require(path.join(__dirname, '..', 'services', 'lobbyService.js'));
var websocketService = require(path.join(__dirname, '..', 'websocket', 'websocketService.js'));
// var lobbyService = require('../services/lobbyService');
// var websocketService = require('../websocket/websocketService');

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
            res.status(400).send(err);
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
            res.status(400).send(err);
        } else{
            res.format({
                'application/json': function(){
                    res.json(data);
                }
            });
        }
    });
}

export function retrieveRoom(req : express.Request, res : express.Response){
    lobbyService.retrieveRoom(req, function(err, data) {
        if(err){
            res.status(400).send(err);
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




