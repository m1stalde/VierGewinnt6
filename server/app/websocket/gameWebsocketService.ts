/// <reference path="../_all.ts"/>

import gameService = require('../services/gameService');
import gameLogic = require('../logic/gameLogic');

export function handleGameDoMoveMessage(message: any, callback: (err: Error, message: IGameUpdateMessage) => void): void {
    var self = this;

    gameService.doMove(message.body.gameId, message.body.col, function (err, gameData) {
        if (err) {
            callback (err, null);
            return;
        }

        var message = {
            header: {
                type: "GameUpdateMessage",
                subType: null
            },
            body: {
                game: gameData
            }
        };

        callback (err, message);
    });
}

export interface IGameUpdateMessage extends app.interfaces.IMessage {
    body: {
        game: gameLogic.IGameData;
    }
}
