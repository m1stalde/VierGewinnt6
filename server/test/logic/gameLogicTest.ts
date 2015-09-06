/// <reference path="../../typings/tsd.d.ts"/>
'use strict';

import chai = require('chai');
import gameLogic = require('../../app/logic/gameLogic');

var should = chai.should();
var game: gameLogic.Game = null;

describe('Game Logic Tests:', () => {

    beforeEach(function () {
        game = new gameLogic.Game(null);
    });

    describe('new game', () => {
        it('a new game should start with color red', (done) => {
            game.newGame('playerId1', 'playerId2', gameLogic.Color.Red, (err, gameData) => {
                gameData.should.not.be.null;
                gameData.playerId1.should.equal('playerId1');
                gameData.playerId2.should.equal('playerId2');
                gameData.nextColor.should.equal(gameLogic.Color.Red);
                done();
            });
        });

        it('a new game should start with color yellow', (done) => {
            game.newGame('playerId1', 'playerId2', gameLogic.Color.Yellow, (err, gameData) => {
                gameData.should.not.be.null;
                gameData.playerId1.should.equal('playerId1');
                gameData.playerId2.should.equal('playerId2');
                gameData.nextColor.should.equal(gameLogic.Color.Yellow);
                done();
            });
        });

        it('a new game should have 6*7 empty cells', (done) => {
            game.newGame('playerId1', 'playerId2', gameLogic.Color.Yellow, (err, gameData) => {
                gameData.cells.should.not.be.null;
                gameData.cells.length.should.equal(6);
                gameData.cells.forEach(row => {
                    row.length.should.equal(7);
                    row.forEach(cell => {
                        cell.should.be.equal(gameLogic.Color.None);
                    });
                });
                done();
            });
        });
    });
});