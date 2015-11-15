/// <reference path="../_all.ts"/>
'use strict';

import express = require('express');
import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');
import security = require('../utils/security');

export function getGame(req: GameControllerRequest, res: express.Response, next: Function) {
    var playerId = security.getServerSession(req).getPlayerId();

    var gameId = req.params.id;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    gameService.getGame(gameId, playerId, function(err, gameData) {
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
    var playerId = security.getServerSession(req).getPlayerId();

    gameService.newGame(playerId, playerId, gameLogic.Color.Yellow, function(err, gameData, gameId) {
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
    var playerId = security.getServerSession(req).getPlayerId();

    var gameId = req.params.id;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    var col = req.query.col;
    if (col == undefined) {
        res.status(400).send('Bad Request: col missing');
        return;
    }

    gameService.doMove(gameId, playerId, col, function (err, gameData) {
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

export function restartGame(req: GameControllerRequest, res: express.Response, next: Function) {
    var playerId = security.getServerSession(req).getPlayerId();

    var gameId = req.params.id;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    gameService.restartGame(gameId, playerId, function(err, gameData) {
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

export function breakGame(req: GameControllerRequest, res: express.Response, next: Function) {
    var playerId = security.getServerSession(req).getPlayerId();

    var gameId = req.params.id;
    if (!gameId) {
        res.status(400).send('Bad Request: gameId missing');
        return;
    }

    gameService.breakGame(gameId, playerId, function(err, gameData) {
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

interface GameControllerRequest extends express.Request {
    gameId: string;
    col: number;
}