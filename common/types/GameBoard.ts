export type GameBoard = GameBoardCellContent[][];

export type GameBoardCellContent = string | "N"; // Username or nothing.

export interface GameBoardCoords {
    row: number;
    column: number;
}
