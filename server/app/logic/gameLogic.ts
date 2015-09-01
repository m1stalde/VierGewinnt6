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

        var cells: number[][] = new Array(rowCount);
        for (var row: number = 0; row < rowCount; row++) {
            cells[row] = new Array(colCount);
            for (var col: number = 0; col < colCount; col++) {
                cells[row][col] = Color.None;
            }
        }

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
    doMove(playerId: string, col: number, callback: (err: Error, gameData: IGameData) => void): void {
        if (!(playerId && col != undefined)) {
            callback(new Error('playerId and col required'), null);
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

        // do the move and switch color and user
        this.gameData.cells[nextCell][col] = this.gameData.nextColor;
        this.gameData.nextColor = this.gameData.nextColor === Color.Red ? Color.Yellow : Color.Red;
        this.gameData.nextPlayerId = this.gameData.playerId1 === playerId ? this.gameData.playerId2 : this.gameData.playerId1;

        // TODO implement finish check
        this.gameData.state = GameState.Running;

        callback(null, this.gameData);
    }

    private getNextCell(col: number) : number {
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
}

export enum Color {
    None = 0,
    Red = 1,
    Yellow = 2
}

export enum GameState {
    New = 0,
    Running = 1,
    Finished = 2
}

export interface IGameData {
    cells: Color[][];
    nextColor: Color;
    nextPlayerId: string;
    playerId1: string;
    playerId2: string;
    state: GameState;
}