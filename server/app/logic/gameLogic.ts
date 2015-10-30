/// <reference path="../_all.ts"/>
'use strict';

export class Game {

    private gameData: IGameData;

    /**
     * Initializes new or existing game.
     * @param gameData existing game data or undefined
     */
    constructor(gameData: IGameData) {
        this.gameData = gameData;
    }

    /**
     * Create new game for given users, playerId1 begins to play.
     * @param playerId1 id of player 1
     * @param playerId2 id of player 2
     * @param startColor first color for new game or undefined
     * @param callback with result or error
     */
    public newGame(playerId1: string, playerId2: string, startColor: Color, callback: (err: Error, gameData: IGameData) => void): void {
        if(!(playerId1 && playerId2)) {
            callback(new Error('playerId1 and playerId2 required'), null);
            return;
        }

        var rowCount = 6;
        var colCount = 7;
        var nextColor = Color.Yellow;

        if (startColor) {
            nextColor = startColor;
        }

        var cells = this.initCells(rowCount, colCount);

        this.gameData = {
            cells: cells,
            nextColor: nextColor,
            nextPlayerId: playerId1,
            playerId1: playerId1,
            playerId2: playerId2,
            state: GameState.New
        }

        callback(null, this.gameData);
    }

    /**
     * Does the next move.
     * @param playerId player who put tile into
     * @param col column to put tile into
     * @param callback with result or error
     */
    public doMove(playerId: string, col: number, callback: (err: Error, gameData: IGameData) => void): void {
        if (!(playerId && col != undefined)) {
            callback(new Error('playerId and col required'), null);
            return;
        }

        // check game state
        if (this.gameData.state === GameState.Finished || this.gameData.state === GameState.Broken) {
            callback(new Error("game is in wrong state"), null);
            return;
        }

        // check if given user is on the move
        if (this.gameData.nextPlayerId !== playerId) {
            callback(new Error("player " + playerId + " isn't on the move"), null);
            return;
        }

        var rowCount = this.gameData.cells.length;
        var colCount = this.gameData.cells[0].length;

        if (col < 0 || col >= colCount) {
            if (callback) callback(new Error("col value " + col + " out of range"), null);
            return;
        }

        var nextCell = this.getNextCell(col);
        if (nextCell < 0) {
            if (callback) callback(new Error("col " + col + " already full"), null);
            return;
        }

        // do the move
        this.gameData.cells[nextCell][col] = this.gameData.nextColor;

        // if current player wins, set game to finished, else switch to next player
        if (this.isWinner(this.gameData.nextColor)) {
            this.gameData.state = GameState.Finished;
        } else {
            this.gameData.state = GameState.Running;
            this.gameData.nextColor = this.gameData.nextColor === Color.Red ? Color.Yellow : Color.Red;
            this.gameData.nextPlayerId = this.gameData.playerId1 === playerId ? this.gameData.playerId2 : this.gameData.playerId1;
        }

        callback(null, this.gameData);
    }

    private getNextCell(col: number): number {
        var rowCount = this.gameData.cells.length;
        var result = -1;

        for (var row: number = rowCount - 1; row >= 0; row--) {
            if (this.gameData.cells[row][col] === Color.None) {
                result = row;
                break;
            }
        }

        return result;
    }

    /**
     * Returns true if given color has 4 tiles in a set.
     * @param color color to check
     * @returns {boolean}
     */
    public isWinner(color: Color): boolean {
        var cells = this.gameData.cells;
        var rowCount = this.gameData.cells.length;
        var colCount = this.gameData.cells[0].length;
        var winCount = 4;
        var cellCount = 0;

        var checkCellCount = function (row: number, col: number): boolean {
            cellCount = (cells[row][col] === color) ? cellCount + 1 : 0;
            return cellCount >= winCount;
        }

        // horizontal check
        for (var row = 0; row < rowCount; row++) {
            cellCount = 0;
            for (var col = 0; col < colCount; col++) {
                if (checkCellCount(row, col)) {
                    return true;
                }
            }
        }

        // vertical check
        for (var col = 0; col < colCount; col++) {
            cellCount = 0;
            for (var row = 0; row < rowCount; row++) {
                if (checkCellCount(row, col)) {
                    return true;
                }
            }
        }

        // diagonal checks
        for (var col = 0; col < colCount; col++) {
            for (var row = 0; row < rowCount; row++) {
                cellCount = 0;
                for (var off = 0; off < Math.min(colCount - col, rowCount - row); off++) {
                    if (checkCellCount(row + off, col + off)) {
                        return true;
                    }
                }
            }
        }

        // invers diagonal checks
        for (var col = colCount - 1; col >= 0; col--) {
            for (var row = 0; row < rowCount; row++) {
                cellCount = 0;
                for (var off = 0; off < Math.min(col + 1, rowCount - row); off++) {
                    if (checkCellCount(row + off, col - off)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Restarts game.
     * @param playerId player who put tile into
     * @param callback with result or error
     */
    public restartGame(playerId: string, callback: (err: Error, gameData: IGameData) => void): void {
        if (!playerId) {
            callback(new Error('playerId required'), null);
            return;
        }

        // check if given user is a player in the game
        if (!this.isGamePlayer(playerId)) {
            callback(new Error("player " + playerId + " isn't on the game"), null);
            return;
        }

        // restart game
        var rowCount = this.gameData.cells.length;
        var colCount = this.gameData.cells[0].length;
        this.gameData.cells = this.initCells(rowCount, colCount);
        this.gameData.state = GameState.New;

        callback(null, this.gameData);
    }

    /**
     * Breaks game.
     * @param playerId player who put tile into
     * @param callback with result or error
     */
    public breakGame(playerId: string, callback: (err: Error, gameData: IGameData) => void): void {
        if (!playerId) {
            callback(new Error('playerId required'), null);
            return;
        }

        // check if given user is a player in the game
        if (!this.isGamePlayer(playerId)) {
            callback(new Error("player " + playerId + " isn't on the game"), null);
            return;
        }

        // set game state to broken
        this.gameData.state = GameState.Broken;

        callback(null, this.gameData);
    }

    /**
     * Sets all cells with given dimensions to color none.
     * @param rowCount vertical dimension
     * @param colCount horizontal dimension
     */
    private initCells(rowCount: number, colCount: number): number[][] {
        var cells: number[][] = new Array(rowCount);
        for (var row: number = 0; row < rowCount; row++) {
            cells[row] = new Array(colCount);
            for (var col: number = 0; col < colCount; col++) {
                cells[row][col] = Color.None;
            }
        }
        return cells;
    }

    /**
     * Returns true if given player is a player in the game, else false.
     * @param playerId
     */
    public isGamePlayer(playerId: string): boolean {
        return this.gameData.playerId1 === playerId || this.gameData.playerId2 === playerId;
    }
}

export enum Color {
    None = 0,
    Red = 1,
    Yellow = 2
}

export enum GameState {
    New = 0,
    Running = 1,
    Finished = 2,
    Broken = 3
}

export interface IGameData {
    cells: Color[][];
    nextColor: Color;
    nextPlayerId: string;
    playerId1: string;
    playerId2: string;
    state: GameState;
}