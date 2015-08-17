export class Game {

    gameData: IGameData;

    /**
     * Initializes new or existing game.
     * @param gameData existing game data or undefined
     * @param startColor first color for new game or undefined
     */
    constructor(gameData: IGameData, startColor: Color) {
        if (gameData) {
            this.gameData = gameData;
        } else {
            this.gameData = this.createGameData(startColor);
        }
    }

    private createGameData(startColor: Color): IGameData {
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

        return {
            cells: cells,
            nextColor: nextColor,
            gameId: null
        }
    }

    /**
     * Does the next move.
     * @param col column to put tile into
     * @param callback success or failure
     */
    doMove(col: number, callback: (err: Error) => void) {
        var rowCount = this.gameData.cells.length;
        var colCount = this.gameData.cells[0].length;

        if (col < 0 || col >= colCount) {
            if (callback) callback(new Error("col value " + col + " out of range"));
            return false;
        }

        var nextCell = this.getNextCell(col);
        if (nextCell < 0) {
            if (callback) callback(new Error("col " + col + " already full"));
            return false;
        }

        this.gameData.cells[nextCell][col] = this.gameData.nextColor;

        this.gameData.nextColor = this.gameData.nextColor === Color.Red ? Color.Yellow : Color.Red;

        callback(null);
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

export interface IGameData {
    cells: Color[][];
    nextColor: Color;
    gameId: string;
}