/// <reference path="../_all.ts"/>

import Datastore = require('nedb');
import gameLogic = require('../logic/gameLogic');

var db = new Datastore({ filename: './data/game.db', autoload: true });

// every update inserts a new record for performance reason
// compact database every 60 seconds to remove duplicated rows
db.persistence.setAutocompactionInterval(60000);

/**
 * Returns saved game data by given id.
 * @param gameId id to load game data
 * @param callback called after execution
 */
export function getGame(gameId: string, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    db.findOne<gameLogic.IGameData>({_id: gameId}, function (err, doc) {
        doc.gameId = gameId;
        callback(err, doc);
    });
}

/**
 * Creates and persists new game.
 * @param startColor first color or undefined to select default color
 * @param callback called after execution
 */
export function newGame(startColor: gameLogic.Color, callback: (err: Error, gameData: gameLogic.IGameData, gameId: string) => void) {
    var gameData = new gameLogic.Game(null, startColor).gameData;
    db.insert(gameData, function (err, newDoc: IGameDataPersisted) {
        gameData.gameId = newDoc._id;
        callback(err, gameData, gameData.gameId);
    });
}

/**
 * Does next move on game by given id and persists result.
 * @param gameId game to do next move
 * @param col column to put tile into
 * @param callback called after execution
 */
export function doMove(gameId: string, col: number, callback: (err: Error, gameData: gameLogic.IGameData) => void) {
    getGame(gameId, function (err, gameData) {
        if (err) {
            callback(err, null);
            return;
        }

        var game = new gameLogic.Game(gameData, null);

        game.doMove(col, function (err) {
            if (err) {
                callback(err, null);
                return;
            }

            db.update({_id: gameId}, game.gameData, function(err) {
                callback(err, game.gameData);
            });
        });
    });
}

interface IGameDataPersisted extends gameLogic.IGameData {
    _id : string;
}
