/// <reference path="../_all.ts"/>

import Datastore = require('nedb');
import gameLogic = require('../logic/game');

var db = new Datastore({ filename: './data/game.db', autoload: true });

export function getGame(gameId, callback) {
    db.findOne({_id: gameId}, function (err, newDoc) {
        if (callback) {
            if (err) {
                callback(err);
            } else {
                callback(err, createGame(newDoc));
            }
        }
    });
}

export function insertGame(game, callback) {
    db.insert(game, function(err, newDoc) {
        if(callback) {
            if (err) {
                callback(err);
            } else {
                callback(err, createGame(newDoc));
            }
        }
    });
}

export function updateGame(gameId, game, callback) {
    db.update({_id: gameId}, game, function(err) {
        if(callback) {
            if (err) {
                callback(err);
            } else {
                callback(err, game);
            }
        }
    });
}

function createGame(doc) : gameLogic.Game {
    var game = new gameLogic.Game(null, doc);
    game.id = doc._id;
    return game;
}