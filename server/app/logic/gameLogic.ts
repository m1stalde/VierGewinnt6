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
     * Create new game for given users, userId1 begins to play.
     * @param userId1 user id of player 1
     * @param userId2 user id of player 2
     * @param startColor first color for new game or undefined
     * @param callback with result or error
     */
    public newGame(userId1: string, userId2: string, startColor: Color, callback: (err: Error, gameData: IGameData) => void): void {
        if(!(userId1 && userId2)) {
            callback(new Error('userId1 and userId2 required'), null);
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
            nextUserId: userId1,
            userId1: userId1,
            userId2: userId2,
            state: GameState.New
        }

        callback(null, this.gameData);
    }

    /**
     * Does the next move.
     * @param userId user who put tile into
     * @param col column to put tile into
     * @param callback with result or error
     */
    doMove(userId: string, col: number, callback: (err: Error, gameData: IGameData) => void): void {
        if (!(userId && col != undefined)) {
            callback(new Error('userId and col required'), null);
            return;
        }

        // check if given user is on the move
        if (this.gameData.nextUserId !== userId) {
            callback(new Error("user " + userId + " isn't on the move"), null);
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
        this.gameData.nextUserId = this.gameData.userId1 === userId ? this.gameData.userId2 : this.gameData.userId1;

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
    nextUserId: string;
    userId1: string;
    userId2: string;
    state: GameState;
}