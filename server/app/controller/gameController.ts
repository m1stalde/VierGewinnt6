/// <reference path="../_all.ts"/>

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/game');

export function getGame(req : express.Request, res : express.Response) {
    var gameId = req.body.gameId;
    if (!gameId) {
        throw new RangeError("gameId missing");
    }

    gameService.getGame(gameId, function(err, game) {
        res.format({
            'application/json': function(){
                res.json(game);
            },
        });
    });
}

export function initGame(req : express.Request, res : express.Response) {
    var color = req.body.color;
    if (!color) {
        color = gameLogic.Color.Yellow;
    }

    var game = new gameLogic.Game(color, null);

    gameService.insertGame(game, function(err, game) {
        res.format({
            'application/json': function(){
                res.json(game);
            },
        });
    });
}

export function doMove(req : express.Request, res : express.Response, next : any) {
    var gameId = req.body.gameId;
    if (gameId == undefined) {
        throw new RangeError("gameId missing");
    }

    var col = req.body.col;
    if (col == undefined) {
        throw new RangeError("col missing");
    }

    gameService.getGame(gameId, function (err, game : gameLogic.Game) {
        try {
            game.doMove(col);
        } catch(err) {
            // TODO check for better error handling
            next(err);
            return;
        }

        gameService.updateGame(gameId, game, function (err, game) {
            res.format({
                'application/json': function(){
                    res.json(game);
                },
            });
        });
    });
}
