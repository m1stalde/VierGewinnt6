/// <reference path="../_all.ts"/>
'use strict';

import Datastore = require('nedb');
import gameLogic = require('../logic/gameLogic');
import messageService = require('../services/messageService');
import logger = require('../utils/logger');

var db = new Datastore({ filename: './data/game.db', autoload: true });

// every update inserts a new record for performance reason
// compact database every 60 seconds to remove duplicated rows
db.persistence.setAutocompactionInterval(60000);

/**
 * Returns saved game data by given id.
 * @param gameId id to load game data
 * @param playerId player who loads the game
 * @param callback called after execution
 */
export function getGame(gameId: string, playerId: string, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    if(!(gameId && playerId)) {
        callback(new Error('gameId and playerId required'), null);
        return;
    }

    db.findOne<gameLogic.IGameData>({_id: gameId}, function (err, gameData) {
        if (err) {
            callback(err, null);
            return;
        }

        var game = new gameLogic.Game(gameData);

        if (!game.isGamePlayer(playerId)) {
            callback(new Error("player " + playerId + " isn't on the game"), null);
            return;
        }

        callback(err, gameData);
    });
}

/**
 * Creates and persists new game.
 * @param playerId1 player id of player 1
 * @param playerId2 player id of player 2
 * @param startColor first color or undefined to select default color
 * @param callback called after execution
 */
export function newGame(playerId1: string, playerId2: string, startColor: gameLogic.Color, callback: (err: Error, gameData: gameLogic.IGameData, gameId: string) => void) {
    if(!(playerId1 && playerId2)) {
        callback(new Error('playerId1 and playerId2 required'), null, null);
        return;
    }

    var game = new gameLogic.Game(null);
    logger.info('new game: playerId1=' + playerId1 + ', playerId2=' + playerId2);

    game.newGame(playerId1, playerId2, startColor, function (err, gameData) {
        if (err) {
            callback(err, null, null);
            return;
        }

        db.insert(gameData, function (err, newDoc: IGameDataPersisted) {
            sendGameUpdateMessage(newDoc._id, newDoc);
            callback(err, gameData, newDoc._id);
        });
    });
}

/**
 * Does next move on game by given id and persists result.
 * @param gameId game to do next move
 * @param playerId player who do next move
 * @param col column to put tile into
 * @param callback called after execution
 */
export function doMove(gameId: string, playerId: string, col: number, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    if(!(gameId && playerId && col != undefined)) {
        callback(new Error('gameId and playerId and col required'), null);
        return;
    }

    getGame(gameId, playerId, function (err, gameData) {
        if (err) {
            callback(err, null);
            return;
        }

        var game = new gameLogic.Game(gameData);

        game.doMove(playerId, col, function (err, gameData) {
            if (err) {
                callback(err, null);
                return;
            }

            db.update({_id: gameId}, gameData, function(err) {
                sendGameUpdateMessage(gameId, gameData);
                callback(err, gameData);
            });
        });
    });
}

/**
 * Restarts and persists existing game.
 * @param gameId game to restart
 * @param playerId player who do next move
 * @param callback called after execution
 */
export function restartGame(gameId: string, playerId: string, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    if(!(gameId && playerId)) {
        callback(new Error('gameId and playerId required'), null);
        return;
    }

    getGame(gameId, playerId, function (err, gameData) {
        if (err) {
            callback(err, null);
            return;
        }

        var game = new gameLogic.Game(gameData);

        game.restartGame(playerId, function (err, gameData) {
            if (err) {
                callback(err, null);
                return;
            }

            db.update({_id: gameId}, gameData, function(err) {
                sendGameUpdateMessage(gameId, gameData);
                callback(err, gameData);
            });
        });
    });
}

/**
 * Breaks and persists existing game.
 * @param gameId game to restart
 * @param playerId player who do next move
 * @param callback called after execution
 */
export function breakGame(gameId: string, playerId: string, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    if(!(gameId && playerId)) {
        callback(new Error('gameId and playerId required'), null);
        return;
    }

    getGame(gameId, playerId, function (err, gameData) {
        if (err) {
            callback(err, null);
            return;
        }

        var game = new gameLogic.Game(gameData);

        game.breakGame(playerId, function (err, gameData) {
            if (err) {
                callback(err, null);
                return;
            }

            db.update({_id: gameId}, gameData, function(err) {
                sendGameUpdateMessage(gameId, gameData);
                callback(err, gameData);
            });
        });
    });
}

function sendGameUpdateMessage(gameId: string, gameData: gameLogic.IGameData): void {
    var gameDataPersisted: IGameDataPersisted = <IGameDataPersisted>gameData;
    gameDataPersisted._id = gameId;
    messageService.sendMessage(new GameUpdateMessage(gameDataPersisted));
}

interface IGameDataPersisted extends gameLogic.IGameData {
    _id : string;
}

export class GameUpdateMessage extends messageService.ServerMessage<IGameDataPersisted> {
    static NAME = "GameUpdateMessage";

    constructor (gameData: IGameDataPersisted) {
        super(GameUpdateMessage.NAME, gameData, null);
        this.playerIds[0] = gameData.playerId1;
        this.playerIds[1] = gameData.playerId2;
    }
}
