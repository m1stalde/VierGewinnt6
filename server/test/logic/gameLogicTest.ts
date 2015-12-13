/// <reference path="../../typings/tsd.d.ts"/>
'use strict';

import chai = require('chai');
import fs = require('fs');
import gameLogic = require('../../app/logic/gameLogic');

var should = chai.should();
var game: gameLogic.Game = null;
var gameData: gameLogic.IGameData = null;

var testData: ITestData;

const playerId1 = 'playerId1';
const playerId2 = 'playerId2';

describe('Game Logic Tests:', () => {

    beforeEach((done) => {
        game = new gameLogic.Game(null);
        game.newGame(playerId1, playerId2, gameLogic.Color.Red, (err, newGameData) => {
            gameData = newGameData;
            done();
        });
    });

    describe('new game', () => {
        it('a new game should start with color red', (done) => {
            game.newGame(playerId1, playerId2, gameLogic.Color.Red, (err, gameData) => {
                gameData.should.not.be.null;
                gameData.playerId1.should.equal(playerId1);
                gameData.playerId2.should.equal(playerId2);
                (<number>gameData.nextColor).should.equal(gameLogic.Color.Red);
                gameData.nextPlayerId.should.equal(playerId1);
                done();
            });
        });

        it('a new game should start with color yellow', (done) => {
            game.newGame(playerId1, 'playerId2', gameLogic.Color.Yellow, (err, gameData) => {
                gameData.should.not.be.null;
                gameData.playerId1.should.equal(playerId1);
                gameData.playerId2.should.equal(playerId2);
                (<number>gameData.nextColor).should.equal(gameLogic.Color.Yellow);
                gameData.nextPlayerId.should.equal(playerId1);
                done();
            });
        });

        it('a new game should have 6*7 empty cells', (done) => {
            game.newGame(playerId1, playerId2, gameLogic.Color.Yellow, (err, gameData) => {
                gameData.cells.should.not.be.null;
                gameData.cells.length.should.equal(6);
                gameData.cells.forEach(row => {
                    row.length.should.equal(7);
                    row.forEach(cell => {
                        (<number>cell).should.be.equal(gameLogic.Color.None);
                    });
                });
                done();
            });
        });
    });

    describe('do move', () => {
        it('do move should switch next player', (done) => {
            game.doMove(playerId1, 0, (err, gameData) => {
                gameData.nextPlayerId.should.equal(playerId2);

                game.doMove(playerId2, 0, (err, gameData) => {
                    gameData.nextPlayerId.should.equal(playerId1);
                    done();
                });
            });
        });

        it('do move should do nothing if player is not on the move', (done) => {
            game.doMove(playerId2, 0, (err, gameData) => {
                err.should.not.be.null;

                game.doMove(playerId1, 1, (err, gameData) => {
                    (<number>gameData.cells[5][0]).should.be.equal(gameLogic.Color.None);
                    done();
                });
            });
        });

        it('do move should do nothing if selected column is full', (done) => {
            var nextPlayerId = gameData.nextPlayerId;
            var nextColor = gameData.nextColor;

            // do six moves to fill first column
            for (var i = 0; i < 6; i++) {
                game.doMove(nextPlayerId, 0, (err, gameData) => {
                    should.not.exist(err);
                    gameData.should.not.be.null;
                    (<number>gameData.cells[5-i][0]).should.be.equal(<number>nextColor);
                });

                nextPlayerId = nextPlayerId === playerId1 ? playerId2 : playerId1;
                nextColor = nextPlayerId === playerId1 ? gameLogic.Color.Red : gameLogic.Color.Yellow;
            }

            // do the seventh, illegal move
            game.doMove(nextPlayerId, 0, (err, gameData) => {
                err.should.not.be.null;
                should.not.exist(gameData);
                done();
            });
        });
    });

    describe('is winner', () => {
        beforeEach((done) => {
            fs.readFile('./test/logic/gameLogicTestData.json', 'utf8', function (err, data) {
                if (err) throw err;
                testData = JSON.parse(data);
                done();
            });
        });

        it('four of same color should be a winner', (done) => {
            testData.gameDataIsWinner.forEach(gameData => {
                game = new gameLogic.Game(gameData);
                game.isWinner(gameData.nextColor).should.be.true;
            });
            done();
        });

        it('three of same color should not be a winner', (done) => {
            testData.gameDataIsNotWinner.forEach(gameData => {
                game = new gameLogic.Game(gameData);
                game.isWinner(gameData.nextColor).should.be.false;
            });
            done();
        });
    });

    describe('finish game', () => {
        it('fill up all game fields should set state to finished', (done) => {
            var playerId = playerId1;

            // fill up game field with two tiles of each color
            for (var col = 0; col < 7; col++) {
                var cnt = 6 - (col % 2);
                for (var row = 0; row < cnt; row++) {
                    game.doMove(playerId, col, (err, gameData) => {
                        (<number>gameData.state).should.be.equal(gameLogic.GameState.Running);
                        playerId = playerId === playerId2 ? playerId1 : playerId2;
                    });
                }
            }

            // set col 1 and 3 in top row
            for (var col = 1; col < 4; col+=2) {
                game.doMove(playerId, col, (err, gameData) => {
                    (<number>gameData.state).should.be.equal(gameLogic.GameState.Running);
                    playerId = playerId === playerId2 ? playerId1 : playerId2;
                });
            }

            // set last col 5 in top row
            game.doMove(playerId, 5, (err, gameData) => {
                (<number>gameData.state).should.be.equal(gameLogic.GameState.Broken);
                done();
            });
        });
    });

    describe('restart game', () => {
        it('restart game should clear game field and state', (done) => {
            game.doMove(playerId1, 0, (err, gameData) => {
                (<number>gameData.cells[5][0]).should.be.equal(gameLogic.Color.Red);
                (<number>gameData.state).should.be.equal(gameLogic.GameState.Running);

                game.restartGame(playerId2, (err, gameData) => {
                    (<number>gameData.cells[5][0]).should.be.equal(gameLogic.Color.None);
                    (<number>gameData.state).should.be.equal(gameLogic.GameState.New);
                    done();
                });
            });
        });

        it('restart game should set next player and color to resetting player', (done) => {
            game.restartGame(playerId2, (err, gameData) => {
                gameData.nextPlayerId.should.be.equal(playerId2);
                (<number>gameData.nextColor).should.be.equal(gameLogic.Color.Yellow);

                game.restartGame(playerId1, (err, gameData) => {
                    gameData.nextPlayerId.should.be.equal(playerId1);
                    (<number>gameData.nextColor).should.be.equal(gameLogic.Color.Red);
                    done();
                });
            });
        });

        it('restart game should do nothing if player is not in the game', (done) => {
            game.restartGame('playerId3', (err, gameData) => {
                err.should.not.be.null;
                done();
            });
        });
    });

    describe('break game', () => {
        it('break game should set state to broken', (done) => {
            game.doMove(playerId1, 0, (err, gameData) => {
                (<number>gameData.cells[5][0]).should.be.equal(gameLogic.Color.Red);
                (<number>gameData.state).should.be.equal(gameLogic.GameState.Running);

                game.breakGame(playerId2, (err, gameData) => {
                    (<number>gameData.cells[5][0]).should.be.equal(gameLogic.Color.Red);
                    (<number>gameData.state).should.be.equal(gameLogic.GameState.Broken);
                    done();
                });
            });
        });

        it('break game should do nothing if player is not in the game', (done) => {
            game.restartGame('playerId3', (err, gameData) => {
                err.should.not.be.null;
                done();
            });
        });
    });
});

interface ITestData {
    gameDataIsWinner: gameLogic.IGameData[];
    gameDataIsNotWinner: gameLogic.IGameData[];
}