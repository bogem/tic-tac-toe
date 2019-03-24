export type GameBoard = GameBoardCellContent[][];

export type GameBoardCellContent = string | null; // Username or nothing.

export interface GameBoardCoords {
    row: number;
    column: number;
}
