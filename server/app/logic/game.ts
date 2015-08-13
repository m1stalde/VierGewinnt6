export class Game {

    private colCount = 7;
    private rowCount = 6;

    id : string;
    cells : Color[][];
    nextColor : Color;

    constructor(nextColor : Color, game : Game) {
        if (nextColor) {
            this.nextColor = nextColor;
        } else {
            this.nextColor = Color.Yellow;
        }

        if (game) {
            this.id = game.id;
            this.cells = game.cells;
            this.nextColor = game.nextColor;
        } else {
            this.initGame();
        }
    }

    private initGame() : void {
        var cells:number[][] = new Array(this.rowCount);
        for (var row : number = 0; row < this.rowCount; row++) {
            cells[row] = new Array(this.colCount);
            for (var col : number = 0; col < this.colCount; col++) {
                cells[row][col] = Color.None;
            }
        }
        this.cells = cells;
    }

    doMove(col : number) : void {
        if (col < 0 || col >= this.colCount) {
            throw new RangeError("col value " + col + " out of range");
        }

        var nextCell = this.getNextCell(col);
        if (nextCell < 0) {
            throw new RangeError("col " + col + " alread full");
        }

        this.cells[nextCell][col] = this.nextColor;

        this.nextColor = this.nextColor == Color.Red ? Color.Yellow : Color.Red;
    }

    private getNextCell(col : number) : number {
        var result = -1;

        for (var row : number = this.rowCount - 1; row >= 0; row--) {
            if (this.cells[row][col] == Color.None) {
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
