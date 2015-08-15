/// <reference path="../_all.ts"/>

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');

export function getGame(req: GameControllerRequest, res: express.Response, next: Function) {
    var gameId = req.body.gameId;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    gameService.getGame(gameId, function(err, gameData) {
        if (err) {
            next(err);
            return;
        }

        res.format({
            'application/json': function(){
                res.json(gameData);
            }
        });
    });
}

export function newGame(req: GameControllerRequest, res: express.Response, next: Function) {
    gameService.newGame(gameLogic.Color.Yellow, function(err, gameData, gameId) {
        if (err) {
            next(err);
            return;
        }

        res.format({
            'application/json': function(){
                res.json(gameData);
            }
        });
    });
}

export function doMove(req: GameControllerRequest, res: express.Response, next: Function) {
    var gameId = req.body.gameId;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    var col = req.body.col;
    if (col == undefined) {
        res.status(400).send('Bad Request: col missing');
        return;
    }

    gameService.doMove(gameId, col, function (err, gameData) {
        if (err) {
            res.status(400).send('Bad Request: ' + err.message);
            return;
        }

        res.format({
            'application/json': function(){
                res.json(gameData);
            }
        });
    });
}

interface GameControllerRequest extends express.Request {
    gameId: string;
    col: number;
}